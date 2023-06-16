import { spawn } from "child_process";
import formidable from "formidable"
import fs from "fs"
import path from "path";

let seedRegex = /Using seed (\w+)/;
let doneRegex = /Done! \((\w+) ms total\)/;
let notAPNGRegex = /is not an APNG/;
let finishRegex = /Finished [\w\/]+ => [\w\/]+ \((\w)[\w\s\/]+, (\w+)[\w\s\/]+\)/;

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let rateLimits = {}

export function getAddress(req) {
	let raw = req.headers["x-remote-address"] ?? req.headers["x-forwarded-for"] ?? req.socket.remoteAddress ?? req.ip;
	let addresses = raw.split(",")
	
	for (let address of addresses) {
		let parsed = address.split(":").at(-1);
		if (parsed != "127.0.0.1" && parsed != "0.0.0.0") 
		return parsed;
	}
}

export const config = {
	api: {
		bodyParser: false
	}
};

const corruptFile = async (file, res) => {
	let output = path.resolve(file.filepath, "../" + file.newFilename + "_output");

	let proc = spawn(process.env.PNGSMASHER_PATH, [
		"-input", file.filepath,
		"-output", output,
		"+o",
		"-splits", 3
	])

	let responsedata = {}
	
	proc.stdout.on("data", data => {
		let str = data.toString();            
		const doneMatch = str.match(doneRegex);
		const finishMatch = str.match(finishRegex);
		const seedMatch = str.match(seedRegex);
		const notAPNGMatch = str.match(notAPNGRegex);

		if (doneMatch)
			responsedata.msFinishTime = doneMatch[1];
		
		if (finishMatch) {
			responsedata.msCorruptionTime = finishMatch[1];
			responsedata.msIOTime = finishMatch[2];
		}
		
		if (seedMatch) {
			responsedata.seed = seedMatch[1];
		}
		
		if (notAPNGMatch)
			responsedata.isAPNG = true;
		else responsedata.isAPNG = false;
	})

	proc.stderr.on("data", data => {
		console.log("stderr: " + data);
	})

	proc.on("close", async code => {
		console.log("code: " + code);

		if (code == 0) {
			var stat = fs.statSync(output);

			res.writeHead(200, {
				"Content-Type": responsedata.isAPNG ? "image/apng" : "image/png",
				"Content-Length": stat.size
			})

			var readStream = fs.createReadStream(output);
    		readStream.pipe(res);
			
			await fs.unlinkSync(file.filepath);
		} else if (code == 1) { // file not found
			res.status(500);
			res.send("Failed to load the image!");
		} else if (code == 2) { // did nothing
			res.status(500);
			res.send("Didn't do anything to the image!");
		}
	})
	
	return;
};

const RatelimitTime = 5 * 1000

export default function handler(req, res) {
	if (req.method != "POST") {
		res.status(405).send("Method Not Allowed");
		return;
	}

	let address = getAddress(req);
	rateLimits[address] = rateLimits[address] ?? 0;

	if (Date.now() - rateLimits[address] < RatelimitTime) {
		let timeLeft = ((5000 - Date.now() + rateLimits[address]) / 1000).toFixed(1);
		return res.status(429).send("You're corrupting too quickly! Wait " + timeLeft + " seconds :)")
	}

	const form = formidable({});
	form.parse(req, async function (err, fields, files) {
		if (!files.file || files.file.length < 1) {
			return res.status(400).send("No file given!")
		}

		let file = files.file[0];
		if (file.mimetype != "image/png") {
			return res.status(400).send("Only PNG images accepted!")
		}

		await corruptFile(file, res);
		rateLimits[address] = Date.now();
	});
}

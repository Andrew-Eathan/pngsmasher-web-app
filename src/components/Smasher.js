import styles from "@/components/Smasher.module.css";
import { useRef, useState } from "react";
import SmasherSlider from "@/components/SmasherSlider";

export default function Smasher() {
	const [image, setImage] = useState(null);
	const [createObjectURL, setCreateObjectURL] = useState(null);

	let imageSelect = event => {
		var selectedFile = event.target.files[0];

		setImage(selectedFile);
		setCreateObjectURL(URL.createObjectURL(selectedFile));
	}
	
	const uploadToServer = async (event) => {
		const body = new FormData();
		body.append("file", image);

		const response = await fetch("/api/pngsmasher", {
			method: "POST",
			body
		});

		if (response.status != 200) {
			alert("Status " + response.status + ": " + await response.text());
			return;
		}

		let data = await response.blob();
		setCreateObjectURL(URL.createObjectURL(data))
	};

	return (
		<div className={styles.smashermain}>
			<div className={styles.smasherwindow}>
				<h2 style={{display: "inline-block", marginRight: "1rem"}}>
					image preview:
				</h2>
				<input type="file" onChange={imageSelect} />
				<br/>
				<div className={styles.imagepreviewdiv}>
					<div>
						<h3>image:</h3>
						<img className={styles.imagepreview} src={createObjectURL} />
					</div>
				</div>
				<button type="submit" onClick={uploadToServer} className={styles.button}>corrupt!</button>
			</div>
			<div className={styles.smasherwindow} style={{justifyContent: "left", textAlign: "left"}}>
				<h2>pngsmasher settings:</h2>
				<br/>
				<SmasherSlider 
					prettyName="Buffer splits" 
					argumentName="splits" 
					description="amount of buffer splits that will be applied, this is a feature that &quot;splits&quot; the image into corrupted-looking segments, simulating realistic image corruption"
					min="0"
					max="24"
					value="0"
				/>
				<br/>
				<SmasherSlider 
					prettyName="Buffer shift amount" 
					argumentName="shift" 
					description="amount of bits to bitshift the image buffer by, this causes a messy colorful corruption effect"
					min="-32"
					max="32"
					value="0"
				/>
				<SmasherSlider 
					prettyName="Buffer shift amount" 
					argumentName="shift" 
					description="amount of bits to bitshift the image buffer by, this causes a messy colorful corruption effect"
					min="-32"
					max="32"
					value="0"
				/>
			</div>
		</div>
	)
}
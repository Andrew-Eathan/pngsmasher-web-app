import { useRef, useState } from "react";
import fxstyles from "@/components/fx.module.css";

function tomag(x, y, mag) {
    let mag1 = Math.sqrt(x * x + y * y);
    return [x / mag1 * mag, y / mag1 * mag]
}

export let FXController = () => {
    const ref = useRef(null);

    const [x, setX] = useState(null);
    const [y, setY] = useState(null);
    const [x1, setX1] = useState(null);
    const [y1, setY1] = useState(null);

    let returnFunc = _ => {
        let timefunc = _ => {
            let x = Math.random() - 0.5
            let y = Math.random() - 0.5
            let bruh = tomag(x, y, 5)
            x = Math.round(bruh[0]); y = Math.round(bruh[1]);
            
            let x1 = Math.random() - 0.5
            let y1 = Math.random() - 0.5
            let bruh1 = tomag(x1, y1, 10)
            x1 = Math.round(bruh1[0]); y1 = Math.round(bruh1[1]);

            setX(x);
            setY(y);
            setX1(x1);
            setY1(y1);

            ref.current.style.animationName = "none";
            ref.current.offsetHeight;
            ref.current.style.animationName = null;

            ref.current.style.animationName = fxstyles.chromaAbberationText
            ref.current.style.animationDuration = (Math.random() * 0.25 + 0.1) + "s";

            setTimeout(timefunc, 100 + Math.random() * 3000);
        };

        setTimeout(timefunc, 100 + Math.random() * 3000);
    }

    return {
        func: returnFunc,
        styles: {
            "--offx": x + "px",
            "--offy": y + "px",
            "--offx1": x1 + "px",
            "--offy1": y1 + "px",
        },
        ref
    }
}
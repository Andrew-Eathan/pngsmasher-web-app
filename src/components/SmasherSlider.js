import { useEffect, useState } from "react"

export default function SmasherSlider({prettyName, argumentName, description, min, max, value}) {
    const [myValue, setValue] = useState(null);

    let valueChanged = (event) => {
        setValue(event.target.value)
    }

    useEffect(_ => setValue(value ?? 0), [])

    return (
        <div>
            <div style={{display: "flex"}}>
                <h3 style={{color: "var(--foreground)", display: "inline-block", marginRight: "0.5rem"}}>{prettyName}: {myValue}</h3>
                <input type="range" style={{flex: 1}} onChange={valueChanged} min={min ?? -10} max={max ?? 10} value={myValue} />
            </div>
            <p style={{color: "var(--foreground-dark)"}}>{description}</p>
        </div>
    )
}
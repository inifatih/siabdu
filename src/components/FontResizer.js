"use client";
import { useFontSize } from "@/context/FontSizeContext";
import { useEffect } from "react";

const FontResizer = () => {
    const { fontSizeIncrement, changeFontSize } = useFontSize();

    const handleSliderChange = (event) => {
        const value = parseInt(event.target.value, 10);
        changeFontSize(value);
    };

    useEffect(() => {
        document.documentElement.style.setProperty("--font-size-increment", `${fontSizeIncrement}px`);
    }, [fontSizeIncrement]);

    return (
        <div>
            <h3>Geser untuk memperbesar ukuran teks</h3>
            <div>
                <label htmlFor="fontSizeSlider"></label>
                <input
                    id="fontSizeSlider"
                    type="range"
                    min="0"
                    max="4"
                    step="2"
                    value={fontSizeIncrement}
                    onChange={handleSliderChange}
                />
                <span>+{fontSizeIncrement}px</span>
            </div>
        </div>
    );
};

export default FontResizer;

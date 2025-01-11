"use client"
import React, { createContext, useContext, useEffect, useState } from "react";

const FontSizeContext = createContext();

export const FontSizeProvider = ({ children }) => {
    const [fontSizeIncrement, setFontSizeIncrement] = useState(0);

    const changeFontSize = (value) => {
        setFontSizeIncrement(value);
    };

    return (
        <FontSizeContext.Provider value={{ fontSizeIncrement, changeFontSize }}>
            {children}
        </FontSizeContext.Provider>
    );
};

export const useFontSize = () => useContext(FontSizeContext);

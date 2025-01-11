"use client";
import { useFontSize } from "@/context/FontSizeContext";

const GlobalStyleWrapper = ({ children }) => {
    const { fontSize } = useFontSize();

    return <div style={{ fontSize: `${fontSize}px` }}>{children}</div>;
};

export default GlobalStyleWrapper;

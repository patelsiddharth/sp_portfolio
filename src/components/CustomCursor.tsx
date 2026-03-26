"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show custom cursor on non-touch devices
        if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

        setIsVisible(true);

        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName.toLowerCase() === "a" ||
                target.tagName.toLowerCase() === "button" ||
                target.closest("a") ||
                target.closest("button")
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
        body * {
          cursor: none !important;
        }
      `}} />
            {/* Outer Circle */}
            <motion.div
                className="fixed top-0 left-0 w-10 h-10 border border-white/50 rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
                animate={{
                    x: mousePosition.x - 20,
                    y: mousePosition.y - 20,
                    scale: isHovering ? 1.5 : 1,
                    backgroundColor: isHovering ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0)",
                    borderColor: isHovering ? "rgba(255,255,255,0)" : "rgba(255, 255, 255, 0.5)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.5 }}
            >
                {/* Inner Dot */}
                <motion.div
                    className="w-2 h-2 bg-white rounded-full mix-blend-difference"
                    animate={{
                        scale: isHovering ? 0 : 1,
                        opacity: isHovering ? 0 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                />
            </motion.div>
        </>
    );
}

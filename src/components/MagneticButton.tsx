"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MagneticButton({
    children,
    className = "",
    onClick,
    href,
    style,
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    href?: string;
    download?: string | boolean;
    style?: React.CSSProperties;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current!.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const props = {
        onMouseMove: handleMouse,
        onMouseLeave: reset,
        onClick,
        className,
        style,
    };

    return (
        <motion.div
            ref={ref}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className="inline-block"
        >
            {href ? (
                <a href={href} {...props}>
                    {children}
                </a>
            ) : (
                <button {...props}>{children}</button>
            )}
        </motion.div>
    );
}

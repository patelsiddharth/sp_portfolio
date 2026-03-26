"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import MagneticButton from "./MagneticButton";

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show the back-to-top button after 1 screen height of scrolling
            if (window.scrollY > window.innerHeight) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Initial check
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[99]"
                >
                    <MagneticButton
                        onClick={scrollToTop}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full glass glass-hover glow-primary flex items-center justify-center text-foreground transition-all hover:scale-105 border border-white/10 bg-background/50 backdrop-blur-md"
                    >
                        <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
                    </MagneticButton>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

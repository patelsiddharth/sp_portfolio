"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function BentoCard({
  children,
  className = "",
  glowColor = "hsl(245 80% 67% / 0.08)",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  delay?: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-2xl border border-white/5 bg-background/50 backdrop-blur-xl overflow-hidden transition-all duration-300 ${hovered ? "border-white/10" : ""} ${className}`}
      style={{
        boxShadow: hovered
          ? `0 0 40px -10px ${glowColor}, inset 0 0 0 1px rgba(255,255,255,0.05)`
          : "none",
      }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 70%)`,
        }}
      />
      <div className="relative z-10 p-5 h-full">{children}</div>
    </motion.div>
  );
}
"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Award {
  icon: React.ReactNode;
  year: string;
  name: string;
  org: string;
  desc: string;
}

interface AnimatedAwardCardProps {
  award: Award;
  index: number;
}

export default function AnimatedAwardCard({ award, index }: AnimatedAwardCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true, amount: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        perspective: "1000px",
      }}
    >
      <motion.div
        className="glass rounded-2xl p-6 transition-all h-full flex flex-col"
        animate={{
          rotateX: isHovered ? 5 : 0,
          rotateY: isHovered ? -5 : 0,
          scale: isHovered ? 1.03 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          transformStyle: "preserve-3d",
          boxShadow: isHovered
            ? "0 0 30px -10px hsl(330 75% 60% / 0.2)"
            : "none",
        }}
      >
        <motion.div
          className="mb-4"
          animate={{ scale: isHovered ? 1.2 : 1, rotate: isHovered ? 10 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {award.icon}
        </motion.div>
        <div className="font-body text-xs text-primary mb-2">{award.year}</div>
        <h3 className="font-display text-base font-bold mb-1">{award.name}</h3>
        <div className="font-body text-xs text-muted-foreground mb-2">
          {award.org}
        </div>
        <motion.p
          className="font-body text-xs text-muted-foreground leading-relaxed mt-auto"
          animate={{ opacity: isHovered ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
        >
          {award.desc}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

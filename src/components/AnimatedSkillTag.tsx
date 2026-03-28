"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

interface AnimatedSkillTagProps {
  label: string;
  delay?: number;
}

export default function AnimatedSkillTag({ label, delay = 0 }: AnimatedSkillTagProps) {
  const ref = useRef(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        scale: 1.1, 
        boxShadow: "0 0 20px rgba(100, 100, 255, 0.3)"
      }}
      transition={{
        delay,
        duration: 0.3,
        type: "spring",
        stiffness: 200,
      }}
      className="px-4 py-2 rounded-full text-xs font-body text-foreground border border-border/50 hover:border-primary/40 transition-all cursor-default group"
    >
      {label}
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SpotlightCard from "./SpotlightCard";

interface ProjectFlipCardProps {
  name: string;
  company: string;
  desc: string;
  tags: string[];
  gradient: string;
  spotlight: string;
  github?: string;
  demo?: string;
  metrics: string[];
}

export default function ProjectFlipCard({
  name,
  company,
  desc,
  tags,
  gradient,
  spotlight,
  github,
  demo,
  metrics,
}: ProjectFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const frontContent = (
    <div className="glass rounded-2xl overflow-hidden transition-all h-full flex flex-col relative z-20 bg-background/50 backdrop-blur-xl border border-white/5">
      <div className="h-1 w-full" style={{ background: gradient }} />
      <div className="p-7 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="font-body text-xs text-muted-foreground">
            {company}
          </span>
        </div>
        <h3 className="font-display text-xl font-bold mb-3">{name}</h3>
        <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">
          {desc}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded-full text-[10px] font-body tracking-wide text-muted-foreground border border-border/50 group-hover:border-primary/30 transition-colors"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const backContent = (
    <div className="glass rounded-2xl overflow-hidden h-full flex flex-col relative z-20 bg-background/50 backdrop-blur-xl border border-white/5">
      <div className="h-1 w-full" style={{ background: gradient }} />
      <div className="p-7 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-display text-lg font-bold mb-4">{name}</h3>
          
          {/* Impact Metrics */}
          <div className="mb-6">
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Impact
            </p>
            <div className="space-y-2">
              {metrics.map((metric, i) => (
                <div key={i} className="font-body text-sm text-foreground/80">
                  • {metric}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <SpotlightCard spotlightColor={spotlight} className="h-full">
      <motion.div
        className="h-full cursor-pointer min-h-80"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          perspective: "1000px",
        }}
      >
        <motion.div
          className="relative w-full h-full rounded-2xl"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          style={{
            transformStyle: "preserve-3d",
            userSelect: "none",
          }}
        >
          {/* Front */}
          <motion.div
            className="absolute w-full h-full rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            {frontContent}
          </motion.div>

          {/* Back */}
          <motion.div
            className="absolute w-full h-full rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {backContent}
          </motion.div>
        </motion.div>
      </motion.div>
    </SpotlightCard>
  );
}

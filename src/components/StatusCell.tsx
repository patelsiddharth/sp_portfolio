"use client";

import { Radio } from "lucide-react";

const STATUS = "Weekends went into this portfolio. Finally wrapping it up.";

export function StatusCell() {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center gap-1.5 mb-3">
        <Radio className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-foreground/50">
          Current Status
        </span>
      </div>
      <p className="font-display text-base md:text-lg font-semibold text-foreground/90 leading-snug flex-1 flex items-center">
        &ldquo;{STATUS}&rdquo;
      </p>
      <div className="mt-3 flex gap-1.5 flex-wrap">
        {["building", "frontend", "open-to-work"].map((tag) => (
          <span
            key={tag}
            className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-primary/20 text-primary/60"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
"use client";

import { motion } from "framer-motion";
import { ExternalLink, Disc3 } from "lucide-react";
import { ISong } from "../types";

export function SpotifyCell({ song }: { song: ISong | null }) {
  if (!song)
    return (
      <div className="flex items-center gap-3 h-full min-h-[90px]">
        <div className="w-12 h-12 rounded-xl bg-muted animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-2.5 w-1/2 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );

  return (
    <a
      href={song.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col h-full"
    >
      <div className="flex items-center gap-1.5 mb-3">
        <svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5 text-[#1DB954] fill-current flex-shrink-0"
        >
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
        <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-foreground/50">
          Recently Played
        </span>
      </div>

      <div className="flex items-center gap-3 flex-1">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10">
            {song.albumImage ? (
              <motion.img
                src={song.albumImage}
                alt={song.title}
                className="w-full h-full object-cover"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Disc3 className="w-6 h-6 text-muted-foreground/30" />
              </div>
            )}
          </div>
          {/* Equaliser bars */}
          <div className="absolute -bottom-1 -right-1 flex items-end gap-[2px] bg-background rounded px-1 py-0.5">
            {[1, 1.5, 0.8, 1.2].map((h, i) => (
              <motion.div
                key={i}
                className="w-[3px] bg-[#1DB954] rounded-full"
                animate={{ scaleY: [h, h * 0.4, h] }}
                transition={{
                  duration: 0.8 + i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
                style={{ height: `${h * 10}px`, transformOrigin: "bottom" }}
              />
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {song.title}
          </p>
          <p className="font-body text-xs text-muted-foreground truncate mt-0.5">
            {song.artist}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/40 group-hover:text-secondary/70 transition-colors whitespace-nowrap">
          <span>View on Spotify</span>
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary/60 flex-shrink-0 transition-colors" />
        </div>
      </div>
    </a>
  );
}
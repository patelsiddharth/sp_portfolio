"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Music, ExternalLink } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

interface Song {
  title: string;
  artist: string;
  albumImage: string;
  url: string;
}

const Spotify = () => {
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await fetch("/api/spotify");
        const data = await res.json();
        setSong(data.song);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSong();
  }, []);

  if (!song) return null;

  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-3xl">
        <RevealOnScroll>
          <p className="section-label">Music</p>
          <h2 className="section-title">
            What I’ve been <span className="gradient-text">listening to</span>
          </h2>
        </RevealOnScroll>

        <motion.a
          href={song.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group glass rounded-2xl overflow-hidden flex gap-6 mt-10 p-5 cursor-pointer"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
        >
          {/* Album */}
          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            {song.albumImage ? (
              <img
                src={song.albumImage}
                alt={song.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Music className="w-8 h-8 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition">
                  {song.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {song.artist}
                </p>
              </div>

              <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60" />
            </div>

            <div className="mt-3">
              <span className="text-xs font-mono px-2.5 py-1 rounded-full border border-primary/30 text-primary bg-primary/10">
                🎧 Recently played
              </span>
            </div>
          </div>
        </motion.a>
      </div>
    </section>
  );
};

export default Spotify;
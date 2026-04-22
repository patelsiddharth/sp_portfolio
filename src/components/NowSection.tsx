"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RevealOnScroll from "./RevealOnScroll";
import { MovieCell } from "./MovieCell";
import { GlobeCell } from "./GlobeCell";
import { BookCell } from "./BookCell";
import { StatusCell } from "./StatusCell";
import { SpotifyCell } from "./SpotifyCell";
import { IBook, IMovie, ISong } from "../types";

// ─── Bento Card wrapper ───────────────────────────────────────────────────────
function BentoCard({
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

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function NowSection() {
  const [song, setSong] = useState<ISong | null>(null);
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [book, setBook] = useState<IBook | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      const [spotifyRes, moviesRes, booksRes] = await Promise.allSettled([
        fetch("/api/spotify").then((r) => r.json()),
        fetch("/api/movies").then((r) => r.json()),
        fetch("/api/currently-reading").then((r) => r.json()),
      ]);
      if (spotifyRes.status === "fulfilled")
        setSong(spotifyRes.value.song ?? null);
      if (moviesRes.status === "fulfilled")
        setMovie(moviesRes.value.movies?.[0] ?? null);
      if (booksRes.status === "fulfilled")
        setBook(booksRes.value.books?.[0] ?? null);
    };
    fetchAll().catch(console.error);
  }, []);

  return (
    <section id="now" className="py-16 md:py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, hsl(245 80% 67% / 0.06), transparent 60%), radial-gradient(ellipse at 20% 80%, hsl(170 70% 50% / 0.05), transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <RevealOnScroll>
          <div className="section-label">Now</div>
          <h2 className="section-title">
            What I&apos;m <span className="gradient-text">up to</span>
          </h2>
          <p className="section-subtitle mb-10">
            A live snapshot — where I am, what I&apos;m reading, watching, and
            listening to.
          </p>
        </RevealOnScroll>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Globe */}
            <BentoCard
              className="md:row-span-2 min-h-[360px]"
              glowColor="hsl(245 80% 67% / 0.15)"
              delay={0}
            >
              <GlobeCell />
            </BentoCard>

            {/* Book */}
            <BentoCard
              className="md:col-span-2 min-h-[220px]"
              glowColor="hsl(170 70% 50% / 0.12)"
              delay={0.08}
            >
              <BookCell book={book} />
            </BentoCard>

            <BentoCard
              className="md:col-span-2 min-h-[220px]"
              glowColor="hsl(330 75% 60% / 0.12)"
              delay={0.14}
            >
              <MovieCell movie={movie} />
            </BentoCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Spotify */}
            <BentoCard
              className="md:col-span-2 min-h-[130px]"
              glowColor="hsl(141 76% 48% / 0.1)"
              delay={0.26}
            >
              <SpotifyCell song={song} />
            </BentoCard>

            {/* Status */}
            <BentoCard
              className="min-h-[130px]"
              glowColor="hsl(245 80% 67% / 0.12)"
              delay={0.2}
            >
              <StatusCell />
            </BentoCard>
          </div>
        </div>
      </div>
    </section>
  );
}

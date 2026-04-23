"use client";

import { useEffect, useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import { BentoCard, MovieCell, GlobeCell, BookCell, StatusCell, SpotifyCell } from "./BentoCell";
import { IBook, IMovie, ISong } from "../types";

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
              glowColor="hsl(245 80% 67% / 0.15)"
              delay={0.08}
            >
              <BookCell book={book} />
            </BentoCard>

            {/* Movie */}
            <BentoCard
              className="md:col-span-2 min-h-[220px]"
              glowColor="hsl(330 75% 60% / 0.12)"
              delay={0.14}
            >
              <MovieCell movie={movie} />
            </BentoCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Status */}
            <BentoCard
              className="md:col-span-2 min-h-[130px]"
              glowColor="hsl(245 80% 67% / 0.12)"
              delay={0.2}
            >
              <StatusCell />
            </BentoCard>

            {/* Spotify */}
            <BentoCard
              className="md:col-span-1 min-h-[130px]"
              glowColor="hsl(141 76% 48% / 0.1)"
              delay={0.26}
            >
              <SpotifyCell song={song} />
            </BentoCard>
          </div>
        </div>
      </div>
    </section>
  );
}

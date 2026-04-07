"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { BookOpen, Film, MapPin, Star, ExternalLink, Disc3, Radio } from "lucide-react";
import createGlobe, { COBEOptions } from "cobe";
import RevealOnScroll from "./RevealOnScroll";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Book {
  title: string;
  author_name: string;
  book_large_image_url: string;
  book_medium_image_url: string;
  book_small_image_url: string;
  average_rating: string;
  num_pages: string;
  link: string;
}

interface Movie {
  title: string;
  link: string;
  description: string;
  poster: string;
}

interface Song {
  title: string;
  artist: string;
  albumImage: string;
  url: string;
}

// ─── Globe ────────────────────────────────────────────────────────────────────
// Jabalpur, MP, India

function GlobeCell() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [r, setR] = useState(0);

  const api = useSpring(0, { stiffness: 120, damping: 30, mass: 1 });

  function updatePointerInteraction(value: number | null) {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  }

  const spring = useSpring(0, {
    stiffness: 80,
    damping: 25,
    mass: 1,
  });

  function updateMovement(clientX: number) {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      // spring.set(delta / 200); // ✅ drive spring
      spring.set(delta / 300);
    }
  }

  useEffect(() => {
    let phi = 4.5;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      width: width * 2,
      height: width * 2,
      devicePixelRatio: 2,
      phi: 5,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 2,
      baseColor: [0.18, 0.14, 0.35],
      markerColor: [0.6, 0.52, 1.0],
      glowColor: [0.35, 0.25, 0.7],
      markers: [
        { location: [23.18, 79.95], size: 0.07 }, // Jabalpur
      ],
    });

    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    }, 100);

    let velocity = 0;
    const animate = () => {
      const springValue = spring.get();

      if (!pointerInteracting.current) {
        velocity *= 0.92;
        phi += velocity;
      } else {
        velocity = springValue * 0.08;
      }

      globe.update({
        phi: phi + springValue,
      });

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative flex flex-col h-full min-h-[320px]">
      {/* Label */}
      <div className="absolute top-4 left-4 z-10">
        <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/60">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Live Location
        </span>
      </div>

      {/* Location badge */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5 border border-white/10">
          <MapPin className="w-3 h-3 text-primary" />
          <span className="font-body text-xs text-foreground/80">Jabalpur, India</span>
        </div>
      </div>

      {/* Globe canvas — pointer events on the wrapper div */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden"
        onPointerDown={(e) => updatePointerInteraction(e.clientX - pointerInteractionMovement.current)}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
      >
        <canvas
          ref={canvasRef}
          className="w-full cursor-grab"
          style={{
            aspectRatio: "1 / 1",
            contain: "layout paint size",
            opacity: 0,
            transition: "opacity 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}

function SpotifyCell({ song }: { song: Song | null }) {
  if (!song) return (
    <div className="flex items-center gap-3 h-full min-h-[90px]">
      <div className="w-12 h-12 rounded-xl bg-muted animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-2.5 w-1/2 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );

  return (
    <a href={song.url} target="_blank" rel="noopener noreferrer" className="group flex flex-col h-full">
      <div className="flex items-center gap-1.5 mb-3">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#1DB954] fill-current flex-shrink-0">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
        <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-foreground/50">Last Played</span>
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
                transition={{ duration: 0.8 + i * 0.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                style={{ height: `${h * 10}px`, transformOrigin: "bottom" }}
              />
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {song.title}
          </p>
          <p className="font-body text-xs text-muted-foreground truncate mt-0.5">{song.artist}</p>
        </div>

        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary/60 flex-shrink-0 transition-colors" />
      </div>
    </a>
  );
}

// ─── Movie Cell ───────────────────────────────────────────────────────────────

function MovieCell({ movie }: { movie: Movie | null }) {
  if (!movie) return (
    <div className="flex items-center gap-3 h-full min-h-[90px]">
      <div className="w-10 h-14 rounded-lg bg-muted animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-2.5 w-1/2 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );

  const cleanDesc = movie.description.replace(/<[^>]*>/g, "").slice(0, 80);

  return (
    <a href={movie.link} target="_blank" rel="noopener noreferrer" className="group flex flex-col h-full">
      <div className="flex items-center gap-1.5 mb-3">
        <Film className="w-3.5 h-3.5 text-secondary" />
        <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-foreground/50">Last Watched</span>
      </div>

      <div className="flex items-start gap-3 flex-1">
        <div className="relative flex-shrink-0 w-10 h-14 rounded-lg overflow-hidden border border-white/10 bg-muted">
          {movie.poster ? (
            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="w-4 h-4 text-muted-foreground/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold text-foreground leading-tight group-hover:text-secondary transition-colors line-clamp-2">
            {movie.title}
          </p>
          {cleanDesc && (
            <p className="font-body text-[11px] text-muted-foreground/60 mt-1 line-clamp-2 leading-relaxed">
              {cleanDesc}{cleanDesc.length >= 80 ? "…" : ""}
            </p>
          )}
        </div>

        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-secondary/60 flex-shrink-0 transition-colors mt-0.5" />
      </div>
    </a>
  );
}

// ─── Book Cell ────────────────────────────────────────────────────────────────

function BookCell({ book }: { book: Book | null }) {
  if (!book) return (
    <div className="flex items-center gap-3 h-full min-h-[90px]">
      <div className="w-10 h-14 rounded-lg bg-muted animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-2.5 w-1/2 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );

  const imageUrl = book.book_large_image_url || book.book_medium_image_url || book.book_small_image_url;
  const rating = parseFloat(book.average_rating);

  return (
    <a href={book.link} target="_blank" rel="noopener noreferrer" className="group flex flex-col h-full">
      <div className="flex items-center gap-1.5 mb-3">
        <BookOpen className="w-3.5 h-3.5 text-accent" />
        <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-foreground/50">Reading Now</span>
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse ml-auto" />
      </div>

      <div className="flex items-start gap-3 flex-1">
        <div className="relative flex-shrink-0 w-10 h-14 rounded-lg overflow-hidden border border-white/10 bg-muted shadow-lg">
          {imageUrl ? (
            <img src={imageUrl} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-muted-foreground/20" />
            </div>
          )}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-white/20 to-white/5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold text-foreground leading-tight group-hover:text-accent transition-colors line-clamp-2">
            {book.title}
          </p>
          <p className="font-body text-[11px] text-muted-foreground/60 mt-0.5">{book.author_name}</p>
          {rating > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              <Star className="w-2.5 h-2.5 fill-yellow-500/60 text-yellow-500/60" />
              <span className="text-[10px] text-muted-foreground/50">{book.average_rating}</span>
              {book.num_pages && (
                <span className="text-[10px] text-muted-foreground/30 ml-1">{book.num_pages}p</span>
              )}
            </div>
          )}
        </div>

        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-accent/60 flex-shrink-0 transition-colors mt-0.5" />
      </div>
    </a>
  );
}

// ─── Status Cell ──────────────────────────────────────────────────────────────

const STATUS = "Weekends went into this portfolio. Finally wrapping it up.";

function StatusCell() {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center gap-1.5 mb-3">
        <Radio className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-foreground/50">Current Status</span>
      </div>
      <p className="font-display text-base md:text-lg font-semibold text-foreground/90 leading-snug flex-1 flex items-center">
        &ldquo;{STATUS}&rdquo;
      </p>
      <div className="mt-3 flex gap-1.5 flex-wrap">
        {["building", "frontend", "open-to-work"].map((tag) => (
          <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-primary/20 text-primary/60">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

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
        boxShadow: hovered ? `0 0 40px -10px ${glowColor}, inset 0 0 0 1px rgba(255,255,255,0.05)` : "none",
      }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 70%)` }}
      />
      <div className="relative z-10 p-5 h-full">{children}</div>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function NowSection() {
  const [song, setSong] = useState<Song | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      const [spotifyRes, moviesRes, booksRes] = await Promise.allSettled([
        fetch("/api/spotify").then((r) => r.json()),
        fetch("/api/movies").then((r) => r.json()),
        fetch("/api/currently-reading").then((r) => r.json()),
      ]);
      if (spotifyRes.status === "fulfilled") setSong(spotifyRes.value.song ?? null);
      if (moviesRes.status === "fulfilled") setMovie(moviesRes.value.movies?.[0] ?? null);
      if (booksRes.status === "fulfilled") setBook(booksRes.value.books?.[0] ?? null);
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
            A live snapshot — where I am, what I&apos;m reading, watching, and listening to.
          </p>
        </RevealOnScroll>

        {/*
          Bento layout:
          ┌──────────────┬──────────────────┐
          │              │  Book            │
          │   Globe      ├──────────────────┤
          │              │  Movie           │
          ├──────┬───────┴──────────────────┤
          │Status│  Spotify                 │
          └──────┴──────────────────────────┘
        */}
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
          <BentoCard className="md:col-span-2 min-h-[140px]" glowColor="hsl(170 70% 50% / 0.12)" delay={0.08}>
            <BookCell book={book} />
          </BentoCard>

          {/* Movie */}
          <BentoCard className="md:col-span-2 min-h-[140px]" glowColor="hsl(330 75% 60% / 0.12)" delay={0.14}>
            <MovieCell movie={movie} />
          </BentoCard>

          {/* Status */}
          <BentoCard className="min-h-[130px]" glowColor="hsl(245 80% 67% / 0.12)" delay={0.2}>
            <StatusCell />
          </BentoCard>

          {/* Spotify */}
          <BentoCard className="md:col-span-2 min-h-[130px]" glowColor="hsl(141 76% 48% / 0.1)" delay={0.26}>
            <SpotifyCell song={song} />
          </BentoCard>

        </div>
      </div>
    </section>
  );
}
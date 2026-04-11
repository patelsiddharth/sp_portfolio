"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Film,
  MapPin,
  Star,
  ExternalLink,
  Disc3,
  Radio,
  Calendar,
  Tags,
} from "lucide-react";
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
  book_description?: string;
  total_pages: string;
  pubDate: string;
}

interface Movie {
  title: string;
  link: string;
  description: string;
  poster: string;
  year?: string;
  rating?: string;
  rewatch?: boolean;
  backdrop?: string;
  genres: string[];
  tmdbRating?: number;
}

interface Song {
  title: string;
  artist: string;
  albumImage: string;
  url: string;
}

// ─── Globe ────────────────────────────────────────────────────────────────────
function GlobeCell() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const LAT = 23.18;
    const LNG = 79.95;
    const theta = LAT * (Math.PI / 180);
    let phi = -LNG * (Math.PI / 90);
    let width = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let velocity = 0;
    let animationFrameId: number;

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
      phi,
      theta,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 2,
      baseColor: [0.18, 0.14, 0.35],
      markerColor: [0.6, 0.52, 1.0],
      glowColor: [0.35, 0.25, 0.7],
      markers: [{ location: [LAT, LNG], size: 0.07 }],
      onRender: (state: any) => {
        state.width = width * 2;
        state.height = width * 2;
      },
    } as any);

    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    }, 100);

    const animate = () => {
      if (!isDragging) {
        if (Math.abs(velocity) > 0.0001) {
          phi += velocity;
          velocity *= 0.92;
        } else {
          velocity = 0;
          phi += 0.002;
        }
      }
      globe.update({ phi, theta });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handlePointerDown = (clientX: number) => {
      isDragging = true;
      lastPointerX = clientX;
      velocity = 0;
    };

    const handlePointerMove = (clientX: number) => {
      if (!isDragging) return;
      const delta = clientX - lastPointerX;
      const dPhi = delta * 0.005;
      phi += dPhi;
      velocity = dPhi;
      lastPointerX = clientX;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const wrapper = canvasRef.current?.parentElement;
    const onPointerDown = (e: PointerEvent) => handlePointerDown(e.clientX);
    const onPointerMove = (e: PointerEvent) => handlePointerMove(e.clientX);

    if (wrapper) {
      wrapper.addEventListener("pointerdown", onPointerDown);
      wrapper.addEventListener("pointermove", onPointerMove);
      wrapper.addEventListener("pointerup", handlePointerUp);
      wrapper.addEventListener("pointerleave", handlePointerUp);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      globe.destroy();
      window.removeEventListener("resize", onResize);
      if (wrapper) {
        wrapper.removeEventListener("pointerdown", onPointerDown);
        wrapper.removeEventListener("pointermove", onPointerMove);
        wrapper.removeEventListener("pointerup", handlePointerUp);
        wrapper.removeEventListener("pointerleave", handlePointerUp);
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col h-full min-h-[320px]">
      <div className="absolute top-4 left-4 z-10">
        <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/60">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Live Location
        </span>
      </div>

      <div className="absolute bottom-4 left-4 z-10">
        <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5 border border-white/10">
          <MapPin className="w-3 h-3 text-primary" />
          <span className="font-body text-xs text-foreground/80">
            Jabalpur, India
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-hidden">
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
          Last Played
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

        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary/60 flex-shrink-0 transition-colors" />
      </div>
    </a>
  );
}

// ─── Movie Cell ───────────────────────────────────────────────────────────────
function MovieCell({ movie }: { movie: Movie | null }) {
  if (!movie)
    return (
      <div className="flex h-full gap-4">
        <div className="w-36 sm:w-40 h-full rounded-xl bg-muted animate-pulse flex-shrink-0" />
        <div className="flex-1 flex flex-col justify-between py-1">
          <div className="space-y-2">
            <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );

  const cleanDesc = movie.description?.replace(/<[^>]*>/g, "") || "";

  return (
    <a
      href={movie.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full gap-4"
    >
      {/* Backdrop */}
      {movie.backdrop && (
        <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition">
          <img
            src={movie.backdrop}
            alt="Last watched backdrop image"
            className="w-full h-full object-cover scale-105 group-hover:scale-110 transition duration-700"
          />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 min-w-0 justify-between">
        <div>
          {/* Label */}
          <span className="inline-block text-[10px] font-mono tracking-[0.15em] uppercase text-muted-foreground/40 mb-1.5">
            Last Watched
          </span>

          {/* Title + CTA */}
          <div className="flex justify-between gap-3">
            <p className="font-display text-lg sm:text-xl font-bold text-foreground leading-tight group-hover:text-secondary transition-colors">
              {movie.title}
            </p>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/40 group-hover:text-secondary/70 transition-colors whitespace-nowrap">
              <span>View on Letterboxd</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground/60 mt-2">
            <div className="flex items-center gap-1">
              {movie.tmdbRating && (
                <>
                  <Star className="w-3 h-3 fill-muted-foreground text-muted-foreground" />
                  <span>{movie.tmdbRating.toFixed(1)}</span>
                </>
              )}{" "}
            </div>
            ·
            <div className="flex items-center gap-1">
              {movie.year && (
                <>
                  <Calendar className="w-3 h-3 text-muted-foreground/60" />
                  <span className="text-xs text-muted-foreground/70">
                    {movie.year}
                  </span>
                </>
              )}{" "}
            </div>
            ·
            <div className="flex items-center gap-1">
              {movie.genres?.length > 0 && (
                <>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
                    <Tags className="w-3 h-3" />
                    <span>{movie.genres.slice(0, 2).join(", ")}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          {cleanDesc && (
            <p className="font-body text-xs text-muted-foreground/60 mt-2 line-clamp-4 leading-relaxed">
              {cleanDesc}
            </p>
          )}
        </div>
      </div>

      {/* Poster */}
      <div className="relative flex-shrink-0 w-28 h-full rounded-xl overflow-hidden border border-white/10 bg-muted shadow-xl z-10">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film className="w-12 h-12 text-muted-foreground/20" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1.5">
          <Film className="w-4 h-4 text-white" />
        </div>
      </div>
    </a>
  );
}

// ─── Book Cell ────────────────────────────────────────────────────────────────
function BookCell({ book }: { book: Book | null }) {
  if (!book)
    return (
      <div className="flex h-full gap-4">
        <div className="w-36 sm:w-40 h-full rounded-xl bg-muted animate-pulse flex-shrink-0" />
        <div className="flex-1 flex flex-col justify-between py-1">
          <div className="space-y-2">
            <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );

  const imageUrl =
    book.book_large_image_url ||
    book.book_medium_image_url ||
    book.book_small_image_url;

  const READING_START_DATE = new Date(book.pubDate);
  const totalPages = parseInt(book.total_pages);

  // days since started
  const daysReading = Math.max(
    1,
    Math.floor(
      (Date.now() - READING_START_DATE.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );

  // clamp so it feels realistic
  const currentPage = Math.min(totalPages - 5, daysReading * 25);

  // progress %
  const progress = currentPage / totalPages;

  return (
    <a
      href={book.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full gap-4"
    >
      {/* Backdrop */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="
            absolute 
            right-[-1%] top-1/2 
            -translate-y-1/2 
            rotate-12 
            scale-125 
            opacity-10 
            group-hover:opacity-20 
            transition duration-700
            pointer-events-none
          "
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <div className="relative z-10 flex-shrink-0 w-28 h-full rounded-xl overflow-hidden border border-white/10 bg-muted shadow-xl">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700
              shadow-lg group-hover:shadow-2xl transition
              ring-1 ring-white/10
            "
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1.5">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col flex-1 min-w-0 justify-between">
        <div>
          <span className="inline-block text-[10px] font-mono tracking-[0.15em] uppercase text-muted-foreground/40 mb-1.5">
            Currently Reading
          </span>
          <div className="flex justify-between">
            <p className="font-display text-lg sm:text-xl font-bold text-foreground leading-tight group-hover:text-accent transition-colors">
              {book.title}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/40 group-hover:text-accent/70 transition-colors">
              <span>View on Goodreads</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>
          <p className="font-body text-sm text-muted-foreground/70 mt-1.5">
            {book.author_name}
          </p>
          {book.book_description && (
            <p className="font-body text-xs text-muted-foreground/60 mt-2 line-clamp-3 leading-relaxed">
              {book.book_description.replace(/<[^>]*>/g, "")}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-purple-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>

          <div className="flex justify-between items-center mt-1">
            <p className="text-[10px] text-muted-foreground">
              {currentPage} / {totalPages} pages
            </p>
            <p className="text-[10px] text-muted-foreground/50">
              {Math.round(progress * 100)}%
            </p>
          </div>
        </div>
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

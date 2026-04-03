"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Film, ExternalLink } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

interface Movie {
  title: string;
  link: string;
  description: string;
  poster: string;
}

const MovieCard = ({ movie, index }: { movie: Movie; index: number }) => {
  return (
    <motion.a
      href={movie.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group glass rounded-2xl overflow-hidden flex flex-col sm:flex-row cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -4 }}
    >
      {/* Poster */}
      <div className="relative w-full sm:w-40 md:w-48 flex-shrink-0 overflow-hidden bg-muted">
        {movie.poster ? (
          <motion.img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-56 sm:h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <div className="w-full h-56 sm:h-full flex items-center justify-center">
            <Film className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent sm:bg-gradient-to-r" />
      </div>

      {/* Info */}
      <div className="flex-1 p-5 md:p-6 flex flex-col justify-center gap-3">
        <div className="flex items-start justify-between">
          <h3 className="font-display text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition">
            {movie.title}
          </h3>

          <motion.div
            className="text-muted-foreground/40 group-hover:text-primary/60"
            whileHover={{ rotate: -15 }}
          >
            <ExternalLink className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Description */}
        {movie.description && (
          <p
            className="text-sm text-muted-foreground/80 line-clamp-2"
            dangerouslySetInnerHTML={{
              __html:
                movie.description
                  .replace(/<[^>]*>/g, "")
                  .slice(0, 120) + "…",
            }}
          />
        )}

        {/* Status */}
        <div className="flex items-center gap-2 mt-1">
          <motion.span
            className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full border border-primary/30 text-primary bg-primary/10"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Recently watched
          </motion.span>
        </div>
      </div>
    </motion.a>
  );
};

const Movies = () => {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("/api/movies");
        const data = await res.json();
        setMovies(data.movies || []);
      } catch (err) {
        console.error(err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="glass rounded-2xl p-8 animate-pulse">
            <div className="flex gap-6">
              <div className="w-32 h-48 rounded-lg bg-muted" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-3xl">
        <RevealOnScroll>
          <p className="section-label">Movies</p>
          <h2 className="section-title">
            What I've been <span className="gradient-text">watching</span>
          </h2>
        </RevealOnScroll>

        <div className="mt-10 space-y-6">
          {movies.map((movie, i) => (
            <MovieCard key={movie.title + i} movie={movie} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Movies;
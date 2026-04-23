"use client";
import {
  Film,
  Star,
  ExternalLink,
  Calendar,
  Tags,
} from "lucide-react";
import { IMovie } from "../../types";

export function MovieCell({ movie }: { movie: IMovie | null }) {
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
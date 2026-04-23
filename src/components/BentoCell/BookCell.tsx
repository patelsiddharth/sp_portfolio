"use client";

import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";
import { IBook } from "../../types";

export function BookCell({ book }: { book: IBook | null }) {
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
            <p className="font-display text-lg sm:text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
              {book.title}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/40 group-hover:text-primary/70 transition-colors">
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
              className="h-full bg-gradient-to-r from-primary to-purple-400"
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
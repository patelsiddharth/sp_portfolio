"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Star, ExternalLink } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

interface Book {
  title: string;
  author_name: string;
  book_large_image_url: string;
  book_medium_image_url: string;
  book_small_image_url: string;
  book_description: string;
  average_rating: string;
  num_pages: string;
  link: string;
}

const BookCard = ({ book, index }: { book: Book; index: number }) => {
  const imageUrl =
    book.book_large_image_url ||
    book.book_medium_image_url ||
    book.book_small_image_url;

  const rating = parseFloat(book.average_rating);

  return (
    <motion.a
      href={book.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group glass rounded-2xl overflow-hidden flex flex-col sm:flex-row gap-0 cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Cover */}
      <div className="relative w-full sm:w-40 md:w-48 flex-shrink-0 overflow-hidden bg-muted">
        {imageUrl ? (
          <motion.img
            src={imageUrl}
            alt={book.title}
            className="w-full h-56 sm:h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <div className="w-full h-56 sm:h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent sm:bg-gradient-to-r" />
      </div>

      {/* Info */}
      <div className="flex-1 p-5 md:p-6 flex flex-col justify-center gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              by {book.author_name}
            </p>
          </div>

          <motion.div
            className="text-muted-foreground/40 group-hover:text-primary/60 transition-colors flex-shrink-0 mt-1"
            whileHover={{ rotate: -15 }}
          >
            <ExternalLink className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {rating > 0 && (
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              {book.average_rating}
            </span>
          )}
          {book.num_pages && <span>{book.num_pages} pages</span>}
        </div>

        {/* Description */}
        {book.book_description && (
          <p
            className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html:
                book.book_description
                  .replace(/<[^>]*>/g, "")
                  .slice(0, 150) + "…",
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
              ease: "easeInOut",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Reading now
          </motion.span>
        </div>
      </div>
    </motion.a>
  );
};

const CurrentlyReading = () => {
  const [books, setBooks] = useState<Book[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/currently-reading");
        const data = await res.json();
        setBooks(data.books || []);
      } catch (err) {
        console.error(err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
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
                <div className="h-3 w-full bg-muted rounded mt-4" />
                <div className="h-3 w-2/3 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!books || books.length === 0) return null;

  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-3xl">
        <RevealOnScroll>
          <p className="section-label">Currently Reading</p>
          <h2 className="section-title">
            What's on my <span className="gradient-text">bookshelf</span>
          </h2>
        </RevealOnScroll>

        <div className="mt-10 space-y-6">
          {books.map((book, i) => (
            <BookCard key={book.title + i} book={book} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurrentlyReading;
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView, useSpring, useTransform } from "framer-motion";
import {
  Heart, Eye, Send, MessageSquare, User,
  Loader2, CheckCircle2, ShieldCheck, ChevronDown
} from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

// Shadcn UI components
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IReview, IStats } from "@/types";

const MOODS = [
  { emoji: "🔥", label: "Fire" },
  { emoji: "😊", label: "Nice" },
  { emoji: "👏", label: "Impressed" },
  { emoji: "💡", label: "Inspiring" },
  { emoji: "🚀", label: "Amazing" },
];

const MOOD_FILTERS = [{ emoji: "✦", label: "All" }, ...MOODS];
const PAGE_SIZE = 5;

// ─── Animated counter (Magic UI Style Number Ticker) ─────────────────────────

function AnimatedCount({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const spring = useSpring(0, { mass: 1, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    if (inView) {
      spring.set(value);
    }
  }, [inView, spring, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

// ─── Time formatter ───────────────────────────────────────────────────────────

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24); if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

// ─── Confetti burst ───────────────────────────────────────────────────────────

function ConfettiBurst({ trigger }: { trigger: boolean }) {
  const particles = Array.from({ length: 18 });
  if (!trigger) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * 360;
        const colors = ["#7c6ee6", "#e64d99", "#2dd4bf", "#f59e0b", "#60a5fa"];
        const color = colors[i % colors.length];
        const size = Math.random() * 6 + 4;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size, height: size, background: color,
              top: "50%", left: "50%",
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * (60 + Math.random() * 40),
              y: Math.sin((angle * Math.PI) / 180) * (60 + Math.random() * 40),
              opacity: 0, scale: 0,
            }}
            transition={{ duration: 0.7, ease: "easeOut", delay: Math.random() * 0.1 }}
          />
        );
      })}
    </div>
  );
}

// ─── Review card ──────────────────────────────────────────────────────────────

function ReviewCard({ review, index, isNew }: { review: IReview; index: number; isNew?: boolean }) {
  const initials = review.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const hues = [245, 330, 170, 200, 280, 30];
  const hue = hues[review.name.charCodeAt(0) % hues.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{ delay: isNew ? 0 : index * 0.05, duration: 0.4, ease: "easeOut" }}
      className={`group glass rounded-2xl p-5 border bg-background/40 backdrop-blur-xl transition-all hover:border-white/10 ${isNew ? "border-primary/30" : "border-white/5"
        }`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar utilizing shadcn ui */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-10 h-10 border-none">
            <AvatarFallback
              className="text-xs font-bold text-white"
              style={{ background: `hsl(${hue} 70% 55%)` }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
            {review.mood}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-body text-sm font-semibold text-foreground">{review.name}</span>
              {isNew && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                  new
                </span>
              )}
            </div>
            <span className="font-body text-xs text-muted-foreground/50 flex-shrink-0">
              {timeAgo(review.createdAt)}
            </span>
          </div>
          <p className="font-body text-sm text-muted-foreground/80 leading-relaxed">{review.message}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SocialProof() {
  const [stats, setStats] = useState<IStats | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formState, setFormState] = useState({ name: "", message: "", mood: "😊" });
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [newReviewId, setNewReviewId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("✦");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch stats
  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats).catch(console.error);
  }, []);

  // Fetch reviews
  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews || []))
      .catch(console.error);
  }, []);

  // Like handler
  const handleLike = useCallback(async () => {
    if (likeLoading || !stats || stats.hasLiked) return;
    setLikeLoading(true);
    setStats((p) => p ? { ...p, likes: p.likes + 1, hasLiked: true } : p);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 800);

    try {
      const res = await fetch("/api/like", { method: "POST" });
      const data = await res.json();
      setStats((p) => p ? { ...p, likes: data.likes, hasLiked: data.hasLiked } : p);
    } catch {
      setStats((p) => p ? { ...p, likes: p.likes - 1, hasLiked: false } : p);
    } finally {
      setLikeLoading(false);
    }
  }, [likeLoading, stats]);

  // Submit review
  const handleSubmit = async () => {
    if (!formState.name.trim() || !formState.message.trim()) return;
    setSubmitState("submitting");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setReviews((p) => [data.review, ...p]);
      setNewReviewId(data.review.id);
      setFormState({ name: "", message: "", mood: "😊" });
      setSubmitState("success");
      setPreviewMode(false);
      setActiveFilter("✦");
      setVisibleCount(PAGE_SIZE);
      setTimeout(() => { setSubmitState("idle"); setNewReviewId(null); }, 5000);
    } catch {
      setSubmitState("error");
      setTimeout(() => setSubmitState("idle"), 3000);
    }
  };

  // Filtered + paginated reviews
  const filtered = activeFilter === "✦"
    ? reviews
    : reviews.filter((r) => r.mood === activeFilter);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const charLeft = 500 - formState.message.length;
  const charWarning = charLeft <= 50;

  return (
    <section id="social-proof" className="py-16 md:py-24 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 20% 50%, hsl(245 80% 67% / 0.07), transparent 60%), radial-gradient(ellipse at 80% 50%, hsl(330 75% 60% / 0.07), transparent 60%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Header ── */}
        <RevealOnScroll>
          <div className="section-label">Community</div>
          <h2 className="section-title">
            Visitors &amp; <span className="gradient-text">Impressions</span>
          </h2>
          <p className="section-subtitle mb-4">
            Real visitors, real feedback — the portfolio in the wild.
          </p>
        </RevealOnScroll>

        {/* ── Stats Strip ── */}
        <RevealOnScroll>
          <div className="grid grid-cols-2 gap-4 mb-12">

            {/* Visits wrapped in shadcn Card component context */}
            <Card className="glass rounded-2xl p-6 border-white/5 bg-background/40 backdrop-blur-xl flex items-center gap-4 shadow-none">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, hsl(245 80% 67% / 0.3), hsl(170 70% 50% / 0.2))" }}>
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-display text-3xl font-bold gradient-text">
                  {stats ? <AnimatedCount value={stats.visits} /> : <span className="opacity-40">—</span>}
                </div>
                <div className="font-body text-xs text-muted-foreground mt-0.5">
                  {stats && stats.visits === 1 ? "1 unique visitor" : `${(stats?.visits ?? 0).toLocaleString()} unique visitors`}
                </div>
              </div>
            </Card>

            {/* Like Component wrapped securely */}
            <motion.button
              onClick={handleLike}
              disabled={likeLoading || !stats || stats.hasLiked}
              className="relative glass rounded-2xl p-6 border border-white/5 bg-background/40 backdrop-blur-xl flex items-center gap-4 cursor-pointer text-left group transition-all hover:border-white/10 disabled:cursor-not-allowed overflow-hidden shadow-none"
              whileHover={!stats?.hasLiked ? { scale: 1.01 } : {}}
              whileTap={!stats?.hasLiked ? { scale: 0.98 } : {}}
            >
              <ConfettiBurst trigger={showConfetti} />
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: stats?.hasLiked
                    ? "linear-gradient(135deg, hsl(330 75% 60% / 0.4), hsl(330 75% 60% / 0.2))"
                    : "linear-gradient(135deg, hsl(330 75% 60% / 0.15), hsl(330 75% 60% / 0.08))",
                }}
              >
                <AnimatePresence mode="wait">
                  {likeLoading ? (
                    <Loader2 key="load" className="w-5 h-5 text-secondary animate-spin" />
                  ) : (
                    <motion.div
                      key={stats?.hasLiked ? "liked" : "not"}
                      initial={{ scale: 0.4, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <Heart className="w-5 h-5 text-secondary" fill={stats?.hasLiked ? "currentColor" : "none"} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div>
                <div className="font-display text-3xl font-bold gradient-text-accent">
                  {stats ? <AnimatedCount value={stats.likes} /> : <span className="opacity-40">—</span>}
                </div>
                <div className="font-body text-xs text-muted-foreground mt-0.5">
                  {stats?.hasLiked ? "Liked ♥ Thank you!" : `${stats?.likes === 1 ? "1 person" : `${stats?.likes ?? 0} people`} liked this`}
                </div>
              </div>
            </motion.button>
          </div>
        </RevealOnScroll>

        {/* ── Form + Reviews ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">

          {/* ── Review Form (shadcn Card) ── */}
          <RevealOnScroll>
            <Card className="glass rounded-2xl border-white/5 bg-background/40 backdrop-blur-xl overflow-hidden shadow-none">
              {/* Header */}
              <CardHeader className="px-7 pt-7 pb-5 border-b border-white/5">
                <div className="flex items-center gap-3 mb-1">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <CardTitle className="font-display text-base font-semibold">Leave a Review</CardTitle>
                </div>
                <CardDescription className="font-body text-xs text-muted-foreground">
                  Worked with me or just browsing? I'd love to hear from you.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-7 space-y-4">
                <AnimatePresence mode="wait">
                  {submitState === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-10 text-center gap-3"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                      >
                        <CheckCircle2 className="w-12 h-12 text-accent" />
                      </motion.div>
                      <p className="font-display text-lg font-semibold">Thanks for the review!</p>
                      <p className="font-body text-sm text-muted-foreground">It means a lot 🙏</p>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

                      {/* Mood selector */}
                      <div>
                        <label className="font-body text-xs text-muted-foreground mb-2 block">
                          How'd you feel about it?
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {MOODS.map(({ emoji, label }) => (
                            <motion.button
                              key={emoji}
                              onClick={() => setFormState((p) => ({ ...p, mood: emoji }))}
                              whileTap={{ scale: 0.9 }}
                              title={label}
                              className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all border ${formState.mood === emoji
                                ? "border-primary/50 bg-primary/15 scale-110"
                                : "border-white/5 bg-white/5 hover:bg-white/10"
                                }`}
                            >
                              {emoji}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Name (shadcn Input) */}
                      <div>
                        <label className="font-body text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5">
                          <User className="w-3 h-3" /> Your name
                        </label>
                        <Input
                          value={formState.name}
                          onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Jane Doe"
                          maxLength={60}
                          className="bg-muted/40 border-border/40 rounded-xl h-12 px-4 text-sm font-body"
                        />
                      </div>

                      {/* Message (shadcn Textarea) */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="font-body text-xs text-muted-foreground flex items-center gap-1.5">
                            <MessageSquare className="w-3 h-3" /> Your message
                          </label>
                          <span className={`text-[10px] font-mono transition-colors ${charWarning ? "text-destructive" : "text-muted-foreground/40"}`}>
                            {charLeft} left
                          </span>
                        </div>
                        <Textarea
                          value={formState.message}
                          onChange={(e) => setFormState((p) => ({ ...p, message: e.target.value }))}
                          placeholder="This portfolio is absolutely stunning..."
                          rows={4}
                          maxLength={500}
                          className="bg-muted/40 border-border/40 rounded-xl px-4 py-3 text-sm font-body resize-none"
                        />
                      </div>

                      {/* Preview toggle */}
                      {formState.name.trim() && formState.message.trim() && (
                        <motion.button
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => setPreviewMode((p) => !p)}
                          className="w-full py-2 rounded-xl text-xs font-body text-muted-foreground border border-white/5 hover:border-white/10 hover:text-foreground transition-all"
                        >
                          {previewMode ? "✏️ Edit" : "👁 Preview your review"}
                        </motion.button>
                      )}

                      {/* Preview */}
                      <AnimatePresence>
                        {previewMode && formState.name && formState.message && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <ReviewCard
                              review={{
                                id: "preview",
                                name: formState.name,
                                message: formState.message,
                                mood: formState.mood,
                                createdAt: Date.now(),
                              }}
                              index={0}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit (shadcn Button wrapped with motion) */}
                      <Button
                        onClick={handleSubmit}
                        disabled={submitState === "submitting" || !formState.name.trim() || !formState.message.trim()}
                        className="w-full h-12 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 hover:scale-[1.01]"
                        style={{ background: "var(--gradient-primary)" }}
                        asChild
                      >
                        <motion.button whileTap={{ scale: 0.98 }}>
                          {submitState === "submitting" ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                          ) : (
                            <><Send className="w-4 h-4 mr-2" /> Submit Review</>
                          )}
                        </motion.button>
                      </Button>

                      {/* Trust note */}
                      <p className="text-center text-[10px] text-muted-foreground/40 flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-3 h-3" />
                        No spam, no account needed. Just your words.
                      </p>

                      {submitState === "error" && (
                        <p className="text-xs text-center text-destructive">Something went wrong. Please try again.</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </RevealOnScroll>

          {/* ── Reviews List ── */}
          <RevealOnScroll delay={0.1}>
            <div className="flex flex-col gap-4">

              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span className="font-body text-sm text-muted-foreground">
                    {reviews.length > 0
                      ? <><span className="text-foreground font-semibold">{reviews.length}</span> review{reviews.length !== 1 ? "s" : ""}</>
                      : "No reviews yet"}
                  </span>
                </div>
              </div>

              {/* Mood filter tabs */}
              {reviews.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {MOOD_FILTERS.map(({ emoji, label }) => {
                    const count = emoji === "✦"
                      ? reviews.length
                      : reviews.filter((r) => r.mood === emoji).length;
                    if (count === 0 && emoji !== "✦") return null;
                    return (
                      <motion.button
                        key={emoji}
                        onClick={() => { setActiveFilter(emoji); setVisibleCount(PAGE_SIZE); }}
                        whileTap={{ scale: 0.92 }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body transition-all border ${activeFilter === emoji
                          ? "border-primary/50 bg-primary/15 text-foreground"
                          : "border-white/5 bg-white/5 text-muted-foreground hover:border-white/10 hover:text-foreground"
                          }`}
                      >
                        <span>{emoji}</span>
                        <span>{label}</span>
                        <span className="opacity-50">({count})</span>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Empty state */}
              {filtered.length === 0 && (
                <div className="glass rounded-2xl p-12 border border-white/5 flex flex-col items-center justify-center text-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-2">
                    <MessageSquare className="w-7 h-7 text-muted-foreground/30" />
                  </div>
                  <p className="font-display text-base font-semibold text-muted-foreground/60">
                    {reviews.length === 0 ? "Be the first!" : "No reviews with this mood yet"}
                  </p>
                  <p className="font-body text-xs text-muted-foreground/40">
                    {reviews.length === 0
                      ? "No one's left a review yet. You could be the first."
                      : "Try a different filter or leave one yourself!"}
                  </p>
                </div>
              )}

              {/* Cards */}
              <div
                className="space-y-3"
                data-lenis-prevent
              >
                <AnimatePresence mode="popLayout">
                  {visible.map((review, i) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      index={i}
                      isNew={review.id === newReviewId}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Load more (shadcn Button) */}
              {hasMore && (
                <Button
                  variant="outline"
                  onClick={() => setVisibleCount((p) => p + PAGE_SIZE)}
                  className="w-full h-12 rounded-xl text-xs font-body text-muted-foreground border border-white/5 hover:border-white/10 hover:bg-white/5 bg-transparent transition-all group"
                  asChild
                >
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ChevronDown className="w-4 h-4 mr-2 group-hover:translate-y-0.5 transition-transform" />
                    Load {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more reviews
                  </motion.button>
                </Button>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
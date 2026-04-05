import React, { useEffect, useState } from "react";

interface Review {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

const PortfolioStatsSection = () => {
  // State for all 4 parts
  const [visitCount, setVisitCount] = useState<number>(0);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  // Fetch stats on mount (placeholder fetches)
  useEffect(() => {
    // TODO: Replace with real API calls
    fetch("/api/portfolio-stats")
      .then((res) => res.json())
      .then((data) => {
        setVisitCount(data.visits || 0);
        setLikeCount(data.likes || 0);
        setLiked(data.liked || false);
        setReviews(data.reviews || []);
      });
  }, []);

  // Like handler
  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setLikeCount((c) => c + 1);
    // TODO: Call API to register like
    await fetch("/api/portfolio-like", { method: "POST" });
  };

  // Review form submit
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.message) return;
    setSubmitting(true);
    // TODO: Call API to submit review
    const res = await fetch("/api/portfolio-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewForm),
    });
    const newReview = await res.json();
    setReviews((r) => [newReview, ...r]);
    setReviewForm({ name: "", message: "" });
    setSubmitting(false);
  };

  return (
    <section className="w-full max-w-3xl mx-auto my-12 p-6 bg-black/80 rounded-xl border border-white/10 grid grid-cols-1 md:grid-cols-4 gap-6 text-white">
      {/* 1. Unique Visit Count */}
      <div className="flex flex-col items-center">
        <span className="text-3xl font-bold">{visitCount}</span>
        <span className="text-xs mt-1 text-gray-400">Unique Visits</span>
      </div>
      {/* 2. Like Button & Count */}
      <div className="flex flex-col items-center">
        <button
          className={`px-4 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-primary/30 transition ${liked ? "opacity-60 cursor-not-allowed" : ""}`}
          onClick={handleLike}
          disabled={liked}
        >
          {liked ? "Liked" : "Like"}
        </button>
        <span className="text-xs mt-1 text-gray-400">{likeCount} Unique Likes</span>
      </div>
      {/* 3. Review Form */}
      <form className="flex flex-col items-center gap-2" onSubmit={handleReviewSubmit}>
        <input
          className="w-full px-2 py-1 rounded bg-white/10 border border-white/20 text-white placeholder:text-gray-400"
          placeholder="Your Name"
          value={reviewForm.name}
          onChange={(e) => setReviewForm((f) => ({ ...f, name: e.target.value }))}
          maxLength={32}
        />
        <textarea
          className="w-full px-2 py-1 rounded bg-white/10 border border-white/20 text-white placeholder:text-gray-400"
          placeholder="Your Review"
          value={reviewForm.message}
          onChange={(e) => setReviewForm((f) => ({ ...f, message: e.target.value }))}
          maxLength={200}
          rows={2}
        />
        <button
          className="px-3 py-1 rounded bg-primary/80 hover:bg-primary text-white text-xs disabled:opacity-50"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Add Review"}
        </button>
      </form>
      {/* 4. Review List */}
      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
        <span className="text-xs text-gray-400 mb-1">Recent Reviews</span>
        {reviews.length === 0 && <span className="text-xs text-gray-500">No reviews yet.</span>}
        {reviews.map((r) => (
          <div key={r.id} className="bg-white/5 rounded p-2 text-xs">
            <span className="font-semibold text-primary mr-2">{r.name}:</span>
            <span>{r.message}</span>
            <span className="block text-[10px] text-gray-500 mt-1">{new Date(r.createdAt).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PortfolioStatsSection;

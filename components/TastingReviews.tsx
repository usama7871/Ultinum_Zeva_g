"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquarePlus, CheckCircle2, Award, Quote } from "lucide-react";

interface ReviewItem {
  id: string;
  author: string;
  role: string;
  rating: number;
  flavor: string;
  comment: string;
  createdAt: string;
}

export default function TastingReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [author, setAuthor] = useState("");
  const [flavor, setFlavor] = useState("Wild Truffle & Mushroom Velvet");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success && data.reviews) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchReviews(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, role: "Verified Tasting Member", rating, flavor, comment }),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (data.success && data.review) {
        setReviews([data.review, ...reviews]);
        setAuthor("");
        setComment("");
        setSubmittedSuccess(true);
        setTimeout(() => {
          setSubmittedSuccess(false);
          setShowForm(false);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-gold text-amber-400 text-xs font-semibold uppercase tracking-widest">
            <Award className="w-3.5 h-3.5" /> Culinary Acclaim
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-amber-50">Tasting Room Notes</h2>
          <p className="text-stone-400 text-sm font-light max-w-lg">
            Endorsed by Michelin-star chefs, holistic nutrition experts, and passionate culinary enthusiasts.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3.5 rounded-full bg-stone-900 border border-amber-500/40 text-amber-300 font-semibold text-xs hover:bg-amber-500 hover:text-stone-950 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>{showForm ? "Close Review Form" : "Submit Tasting Review"}</span>
        </button>
      </div>

      {/* Review Submission Form Modal / Panel */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-3xl border border-amber-500/30 mb-12 max-w-2xl mx-auto space-y-4"
        >
          <h3 className="font-serif text-xl font-bold text-amber-50">Share Your Culinary Experience</h3>

          {submittedSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Thank you! Your tasting review has been recorded to our database.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name or Culinary Title"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  className="px-4 py-3 rounded-xl bg-stone-950 border border-white/15 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
                <select
                  value={flavor}
                  onChange={(e) => setFlavor(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-stone-950 border border-white/15 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Roasted Tomato & Basil Velvet">Roasted Tomato & Basil Velvet</option>
                  <option value="Golden Squash & Turmeric Broth">Golden Squash & Turmeric Broth</option>
                  <option value="Wild Truffle & Mushroom Velvet">Wild Truffle & Mushroom Velvet</option>
                  <option value="Sacred Bone Broth Elixir">Sacred Bone Broth Elixir</option>
                  <option value="Spicy Lemongrass Ginger Detox">Spicy Lemongrass Ginger Detox</option>
                  <option value="Silken Golden Cauliflower">Silken Golden Cauliflower</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-300">
                <span>Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-amber-400 hover:scale-125 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= rating ? "fill-amber-400" : "text-stone-700"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={3}
                placeholder="Describe the aroma, mouthfeel, and tasting notes..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-white/15 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Post Review to Community"}
              </button>
            </form>
          )}
        </motion.div>
      )}

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, index) => (
          <motion.div
            key={rev.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all hover:-translate-y-1"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex text-amber-400 gap-0.5">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-amber-500/20 shrink-0" />
              </div>

              <p className="text-xs text-stone-300 font-light leading-relaxed italic">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-xs font-bold text-amber-200">{rev.author}</p>
              <p className="text-[11px] text-amber-400/80">{rev.role}</p>
              <span className="inline-block mt-2 text-[10px] px-2.5 py-0.5 rounded-full bg-white/5 text-stone-400 border border-white/10">
                {rev.flavor}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

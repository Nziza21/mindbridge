import { useState } from "react";
import api from "../services/api";

const ratingLabel = (r) => {
  if (r >= 5) return "Excellent";
  if (r >= 4) return "Good";
  if (r >= 3) return "Neutral";
  if (r >= 2) return "Poor";
  return "Very poor";
};

export default function Feedback() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setSubmitting(true);
    try {
      await api.post("/feedback", { rating, comments: comment });
      setSuccess("Thank you for your feedback!");
      setRating(5); setComment("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <p className="text-sage text-sm font-medium tracking-widest uppercase mb-2">Your experience</p>
        <h1 className="font-serif text-4xl text-forest mb-10">Share your feedback</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="bg-mist rounded-2xl p-8 text-center">
            <p className="font-serif text-2xl text-forest mb-1">{ratingLabel(rating)}</p>
            <p className="text-sage text-sm mb-6">{rating} out of 5</p>
            <input
              type="range"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full accent-forest"
            />
          </div>

          <div>
            <p className="text-moss text-sm font-medium mb-3">Comments</p>
            <textarea
              placeholder="Tell us about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="w-full bg-mist rounded-xl px-5 py-4 text-forest text-sm placeholder-sand outline-none resize-none focus:ring-2 focus:ring-sage"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-sage text-sm">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-forest text-cream text-sm font-medium py-4 rounded-full hover:bg-moss transition-all duration-300 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}
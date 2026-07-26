import { useState } from "react";
import api from "../services/api";

export default function Feedback() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      // user_id is read from the JWT server-side, and the backend field
      // is "comments" (plural), not "comment".
      await api.post("/feedback", {
        rating,
        comments: comment,
      });
      setSuccess("Thank you for your feedback!");
      setRating(5);
      setComment("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Share Your Feedback
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating: <span className="font-semibold">{rating} / 5</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comments
          </label>
          <textarea
            placeholder="Tell us about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {submitting ? "Submitting..." : "Submit feedback"}
        </button>
      </form>
    </div>
  );
}
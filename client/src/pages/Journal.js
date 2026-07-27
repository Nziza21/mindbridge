import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";

const PROMPTS = [
  "What made today hard?",
  "What are you grateful for today?",
  "What is one thing you want to let go of?",
  "How did you take care of yourself today?",
  "What is one small win from today?",
];

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const moodContext = location.state;

  const token = localStorage.getItem("token");
  const prompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];

  const fetchEntries = async () => {
    try {
      const userId = JSON.parse(atob(token.split(".")[1])).id;
      const res = await api.get(`/journal/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
  fetchEntries();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post(
        "/journal",
        { title: title.trim() || "Untitled Entry", content: content.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setContent("");
      fetchEntries();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save entry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/journal/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEntries();
    } catch (err) {
      setError("Could not delete entry");
    }
  };

  return (
    <div className="min-h-screen bg-cream px-6 py-10">
      <div className="max-w-2xl mx-auto">

        <p className="text-sage text-sm font-medium tracking-widest uppercase mb-2">Private journal</p>
        <h1 className="font-serif text-4xl text-forest mb-2">Write it down</h1>

        {moodContext && (
          <p className="text-moss text-sm mb-8">
            You checked in at {moodContext.moodLevel}/10
            {moodContext.tags?.length ? ` · ${moodContext.tags.join(", ")}` : ""}
          </p>
        )}

        {/* Prompt */}
        <div className="bg-mist rounded-2xl px-6 py-4 mb-8">
          <p className="text-sage text-xs uppercase tracking-widest mb-1">Today's prompt</p>
          <p className="font-serif text-lg text-forest">{prompt}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-12">
          <input
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-mist rounded-xl px-5 py-4 text-forest text-sm placeholder-sand outline-none focus:ring-2 focus:ring-sage"
          />
          <textarea
            placeholder="Write freely here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
            className="bg-mist rounded-xl px-5 py-4 text-forest text-sm placeholder-sand outline-none resize-none focus:ring-2 focus:ring-sage"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="bg-forest text-cream text-sm font-medium py-4 rounded-full hover:bg-moss transition-all duration-300 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save entry"}
          </button>
        </form>

        {/* Past entries */}
        <h2 className="font-serif text-2xl text-forest mb-6">Past entries</h2>
        {entries.length === 0 && (
          <p className="text-sage text-sm">No entries yet. Write your first one above.</p>
        )}
        <div className="flex flex-col gap-4">
          {entries.map((entry) => (
            <div key={entry.journal_id} className="bg-mist rounded-2xl px-6 py-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif text-lg text-forest">{entry.title}</h3>
                <button
                  onClick={() => handleDelete(entry.journal_id)}
                  className="text-sand text-xs hover:text-red-400 transition-all duration-200"
                >
                  Delete
                </button>
              </div>
              <p className="text-moss text-sm leading-relaxed mb-3">{entry.content}</p>
              <p className="text-sand text-xs">
                {new Date(entry.created_at || entry.date).toLocaleDateString("en-GB", {
                  weekday: "long", day: "numeric", month: "long",
                })}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
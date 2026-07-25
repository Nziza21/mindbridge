import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const TAGS = ["Sleep", "Academics", "Homesickness", "Social"];

const moodEmoji = (level) => {
  if (level >= 9) return "😄";
  if (level >= 7) return "🙂";
  if (level >= 5) return "😐";
  if (level >= 3) return "😔";
  return "😞";
};

const moodLabel = (level) => {
  if (level >= 9) return "Excellent";
  if (level >= 7) return "Good";
  if (level >= 5) return "Neutral";
  if (level >= 3) return "Low";
  return "Very low";
};

export default function MoodCheckIn() {
  const [moodLevel, setMoodLevel] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const tagPrefix = selectedTags.length ? `[${selectedTags.join(", ")}] ` : "";
    const fullNotes = tagPrefix + notes;
    try {
      await api.post("/mood", { mood_level: moodLevel, notes: fullNotes });
      navigate("/journal", { state: { moodLevel, tags: selectedTags } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not save mood entry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">

        <p className="text-sage text-sm font-medium tracking-widest uppercase mb-2">Daily check-in</p>
        <h1 className="font-serif text-4xl text-forest mb-10">How are you feeling today?</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* Mood slider */}
          <div className="bg-mist rounded-2xl p-8 text-center">
            <p className="text-6xl mb-4">{moodEmoji(moodLevel)}</p>
            <p className="font-serif text-2xl text-forest mb-1">{moodLabel(moodLevel)}</p>
            <p className="text-sage text-sm mb-6">{moodLevel} out of 10</p>
            <input
              type="range"
              min="1"
              max="10"
              value={moodLevel}
              onChange={(e) => setMoodLevel(Number(e.target.value))}
              className="w-full accent-forest"
            />
          </div>

          {/* Tags */}
          <div>
            <p className="text-moss text-sm font-medium mb-3">What is affecting this?</p>
            <div className="flex gap-3 flex-wrap">
              {TAGS.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedTags.includes(tag)
                      ? "bg-forest text-cream"
                      : "bg-mist text-moss hover:bg-sand hover:text-forest"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-moss text-sm font-medium mb-3">Anything you want to add?</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write freely here..."
              rows={4}
              className="w-full bg-mist rounded-xl px-5 py-4 text-forest text-sm placeholder-sand outline-none resize-none focus:ring-2 focus:ring-sage"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-forest text-cream text-sm font-medium py-4 rounded-full hover:bg-moss transition-all duration-300 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save and continue to journal"}
          </button>

        </form>
      </div>
    </div>
  );
}
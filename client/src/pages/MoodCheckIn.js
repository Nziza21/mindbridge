import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const TAGS = ["Sleep", "Academics", "Homesickness", "Social"];

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

    // backend only stores mood_level + notes right now,
    // so we fold the selected tags into the notes text
    const tagPrefix = selectedTags.length ? `[${selectedTags.join(", ")}] ` : "";
    const fullNotes = tagPrefix + notes;

    try {
      await api.post("/mood", {
        mood_level: moodLevel,
        notes: fullNotes,
      });
      // route into journal with mood context for the prompt
      navigate("/journal", { state: { moodLevel, tags: selectedTags } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not save mood entry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>How are you feeling today?</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Mood: {moodLevel} / 10
          <input
            type="range"
            min="1"
            max="10"
            value={moodLevel}
            onChange={(e) => setMoodLevel(Number(e.target.value))}
          />
        </label>

        <div>
          <p>What's affecting this?</p>
          {TAGS.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => toggleTag(tag)}
              style={{
                fontWeight: selectedTags.includes(tag) ? "bold" : "normal",
                background: selectedTags.includes(tag) ? "#ddeeff" : "#fff",
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        <textarea
          placeholder="Anything you want to add? (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save mood"}
        </button>
      </form>
    </div>
  );
}
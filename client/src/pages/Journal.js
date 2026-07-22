import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api, {
  createJournalEntry,
  getJournalEntries,
  deleteJournalEntry,
} from "../services/api";

export default function Journal() {
  const { user } = useAuth();
  const location = useLocation();

  // If we arrived here from MoodCheckIn, it passes { moodLevel, tags }
  const moodContext = location.state || null;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await getJournalEntries(user.id);
      setEntries(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load journal entries");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Please write something before saving.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      // NOTE: mood_id linking is left out here — the backend doesn't currently
      // return the created mood's id from POST /api/mood, so we have nothing
      // reliable to send. Flag this with Aurore/Lorris if mood-journal linking
      // is needed later.
      await createJournalEntry({
        title: title.trim() || "Untitled Entry",
        content: content.trim(),
      });
      setTitle("");
      setContent("");
      // backend only returns a success message on POST, not the new row,
      // so we re-fetch to get the entry with its real journal_id/created_at
      await fetchEntries();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save journal entry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (journalId) => {
    if (!window.confirm("Delete this entry? This can't be undone.")) return;
    try {
      await deleteJournalEntry(journalId);
      setEntries((prev) => prev.filter((e) => e.journal_id !== journalId));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete entry");
    }
  };

  if (!user) {
    return <p>Please log in to view your journal.</p>;
  }

  return (
    <div>
      <h2>Journal</h2>

      {moodContext && (
        <p>
          Logged mood: {moodContext.moodLevel}/10
          {moodContext.tags?.length ? ` — ${moodContext.tags.join(", ")}` : ""}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <textarea
            placeholder="Write what's on your mind..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Entry"}
        </button>
      </form>

      <h3>Past Entries</h3>
      {loading && <p>Loading...</p>}
      {!loading && entries.length === 0 && <p>No journal entries yet.</p>}

      <ul>
        {entries.map((entry) => (
          <li key={entry.journal_id}>
            <strong>{entry.title}</strong> —{" "}
            {new Date(entry.created_at).toLocaleString()}
            <p>{entry.content}</p>
            <button onClick={() => handleDelete(entry.journal_id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
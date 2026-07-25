import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api
      .get(`/mood/${user.id}`)
      .then((res) => setMoods(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const moodLabel = (level) => {
    if (level >= 9) return "Excellent";
    if (level >= 7) return "Good";
    if (level >= 5) return "Neutral";
    if (level >= 3) return "Low";
    return "Very low";
  };

  const moodColor = (level) => {
    if (level >= 7) return "bg-sage text-cream";
    if (level >= 5) return "bg-sand text-forest";
    return "bg-moss text-cream";
  };

  return (
    <div className="min-h-screen bg-cream px-12 py-10">
      <div className="max-w-3xl mx-auto">
        <p className="text-sage text-sm font-medium tracking-widest uppercase mb-2">Welcome back</p>
        <h1 className="font-serif text-4xl text-forest mb-10">{user?.name}</h1>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          <button
            onClick={() => navigate("/mood-checkin")}
            className="bg-forest text-cream rounded-2xl p-6 text-left hover:bg-moss transition-all duration-300"
          >
            <p className="text-sage text-xs uppercase tracking-widest mb-2">Daily check-in</p>
            <p className="font-serif text-xl">How are you feeling today?</p>
          </button>
          <button
            onClick={() => navigate("/journal")}
            className="bg-mist text-forest rounded-2xl p-6 text-left hover:bg-sand hover:text-cream transition-all duration-300"
          >
            <p className="text-sage text-xs uppercase tracking-widest mb-2">Journal</p>
            <p className="font-serif text-xl">Write something down</p>
          </button>
        </div>

        {/* Mood history */}
        <h2 className="font-serif text-2xl text-forest mb-6">Your mood history</h2>
        {loading && <p className="text-sage text-sm">Loading...</p>}
        {!loading && moods.length === 0 && (
          <p className="text-sage text-sm">No mood entries yet. Start your first check-in.</p>
        )}
        <div className="flex flex-col gap-3">
          {moods.map((m) => (
            <div key={m.mood_id} className="flex items-center justify-between bg-mist rounded-xl px-6 py-4">
              <div>
                <p className="text-forest text-sm font-medium">{m.notes || "No notes"}</p>
                <p className="text-sand text-xs mt-1">{new Date(m.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${moodColor(m.mood_level)}`}>
                {m.mood_level}/10 · {moodLabel(m.mood_level)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
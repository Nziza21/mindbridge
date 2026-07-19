import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    api
      .get(`/mood/${user.id}`)
      .then((res) => setMoods(res.data))
      .catch(() => setError("Could not load mood history"))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Log out</button>

      <h3>Your mood history</h3>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && moods.length === 0 && <p>No mood entries yet.</p>}

      <ul>
        {moods.map((m) => (
          <li key={m.mood_id}>
            <strong>{m.mood_level}/10</strong> —{" "}
            {new Date(m.created_at).toLocaleDateString()}
            {m.notes && <div>{m.notes}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
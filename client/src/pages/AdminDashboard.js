import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [counselors, setCounselors] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", specialization: "" });
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState("");
  const [formError, setFormError] = useState("");

  const fetchData = () => {
    Promise.all([api.get("/counselors"), api.get("/feedback")])
      .then(([counselorRes, feedbackRes]) => {
        setCounselors(counselorRes.data);
        setFeedback(feedbackRes.data);
      })
      .catch(() => setError("Unable to load admin data. Check permissions."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const avgRating = feedback.length
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
    : "—";

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccess("");
    setCreating(true);
    try {
      const token = localStorage.getItem("token");
      await api.post("/admin/create-counselor", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Counselor created successfully");
      setForm({ name: "", email: "", password: "", specialization: "" });
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not create counselor");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream px-12 py-10">
      <div className="max-w-4xl mx-auto">
        <p className="text-sage text-sm font-medium tracking-widest uppercase mb-2">Admin</p>
        <h1 className="font-serif text-4xl text-forest mb-10">Welcome, {user?.name}</h1>

        {loading && <p className="text-sage text-sm">Loading...</p>}
        {error && <p className="text-moss text-sm">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="bg-mist rounded-2xl p-6">
                <p className="text-sage text-xs uppercase tracking-widest mb-2">Counselors</p>
                <p className="font-serif text-3xl text-forest">{counselors.length}</p>
              </div>
              <div className="bg-mist rounded-2xl p-6">
                <p className="text-sage text-xs uppercase tracking-widest mb-2">Feedback entries</p>
                <p className="font-serif text-3xl text-forest">{feedback.length}</p>
              </div>
              <div className="bg-mist rounded-2xl p-6">
                <p className="text-sage text-xs uppercase tracking-widest mb-2">Avg. rating</p>
                <p className="font-serif text-3xl text-forest">{avgRating}</p>
              </div>
            </div>

            <h2 className="font-serif text-2xl text-forest mb-6">Add a counselor</h2>
            <form onSubmit={handleCreate} className="bg-mist rounded-2xl p-8 mb-12 flex flex-col gap-4">
              <input
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="bg-white rounded-xl px-5 py-4 text-forest text-sm placeholder-sand outline-none focus:ring-2 focus:ring-sage"
              />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="bg-white rounded-xl px-5 py-4 text-forest text-sm placeholder-sand outline-none focus:ring-2 focus:ring-sage"
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="bg-white rounded-xl px-5 py-4 text-forest text-sm placeholder-sand outline-none focus:ring-2 focus:ring-sage"
              />
              <input
                placeholder="Specialization"
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                required
                className="bg-white rounded-xl px-5 py-4 text-forest text-sm placeholder-sand outline-none focus:ring-2 focus:ring-sage"
              />
              {formError && <p className="text-red-400 text-sm">{formError}</p>}
              {success && <p className="text-sage text-sm">{success}</p>}
              <button
                type="submit"
                disabled={creating}
                className="bg-forest text-cream text-sm font-medium py-4 rounded-full hover:bg-moss transition-all duration-300 disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create counselor"}
              </button>
            </form>

            <h2 className="font-serif text-2xl text-forest mb-6">Counselors</h2>
            <div className="flex flex-col gap-3 mb-12">
              {counselors.length === 0 && (
                <p className="text-sage text-sm">No counselors on record yet.</p>
              )}
              {counselors.map((c) => (
                <div key={c.counselor_id} className="flex items-center justify-between bg-mist rounded-xl px-6 py-4">
                  <p className="text-forest text-sm font-medium">{c.name}</p>
                  <span className="text-xs text-sand">{c.specialty || "General"}</span>
                </div>
              ))}
            </div>

            <h2 className="font-serif text-2xl text-forest mb-6">Recent feedback</h2>
            <div className="flex flex-col gap-3">
              {feedback.length === 0 && (
                <p className="text-sage text-sm">No feedback submitted yet.</p>
              )}
              {feedback.map((f) => (
                <div key={f.feedback_id} className="flex items-center justify-between bg-mist rounded-xl px-6 py-4">
                  <p className="text-forest text-sm">{f.comments || "No comment"}</p>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-sand text-forest">
                    {f.rating}/5
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
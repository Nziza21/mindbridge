import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [counselors, setCounselors] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([api.get("/counselors"), api.get("/feedback")])
      .then(([counselorRes, feedbackRes]) => {
        setCounselors(counselorRes.data);
        setFeedback(feedbackRes.data);
      })
      .catch(() => setError("Unable to load admin data. Check permissions."))
      .finally(() => setLoading(false));
  }, []);

  const avgRating = feedback.length
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
    : "—";

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

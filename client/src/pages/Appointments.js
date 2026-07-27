import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Appointments() {
  const { user } = useAuth();
  const [counselors, setCounselors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;
    Promise.all([api.get("/counselors"), api.get(`/appointments/${user.id}`)])
      .then(([counselorsRes, appointmentsRes]) => {
        setCounselors(counselorsRes.data);
        setAppointments(appointmentsRes.data);
      })
      .catch(() => setError("Could not load counselors or appointments"))
      .finally(() => setLoading(false));
  }, [user]);

  const handleBook = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!selectedCounselor || !date) { setError("Please select a counselor and a date"); return; }
    setSubmitting(true);
    try {
      await api.post("/appointments", { counselor_id: selectedCounselor, appointment_date: date, notes: "" });
      setSuccess("Appointment request submitted");
      setSelectedCounselor(""); setDate("");
      const res = await api.get(`/appointments/${user.id}`);
      setAppointments(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6 text-sage">Loading...</p>;

  return (
    <div className="min-h-screen bg-cream px-12 py-10">
      <div className="max-w-3xl mx-auto">
        <p className="text-sage text-sm font-medium tracking-widest uppercase mb-2">Book a session</p>
        <h1 className="font-serif text-4xl text-forest mb-10">Appointments</h1>

        <form onSubmit={handleBook} className="bg-mist rounded-2xl p-8 mb-10 flex flex-col gap-5">
          <div>
            <p className="text-moss text-sm font-medium mb-3">Select a counselor</p>
            <select
              value={selectedCounselor}
              onChange={(e) => setSelectedCounselor(e.target.value)}
              className="w-full bg-white rounded-xl px-5 py-4 text-forest text-sm outline-none focus:ring-2 focus:ring-sage"
            >
              <option value="">Choose a counselor</option>
              {counselors.map((c) => (
                <option key={c.counselor_id} value={c.counselor_id}>
                  {c.name} — {c.specialty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-moss text-sm font-medium mb-3">Select a date</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white rounded-xl px-5 py-4 text-forest text-sm outline-none focus:ring-2 focus:ring-sage"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-sage text-sm">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-forest text-cream text-sm font-medium py-4 rounded-full hover:bg-moss transition-all duration-300 disabled:opacity-50"
          >
            {submitting ? "Booking..." : "Book appointment"}
          </button>
        </form>

        <h2 className="font-serif text-2xl text-forest mb-6">Available counselors</h2>
        <div className="flex flex-col gap-3 mb-10">
          {counselors.map((c) => (
            <div key={c.counselor_id} className="flex items-center justify-between bg-mist rounded-xl px-6 py-4">
              <p className="text-forest text-sm font-medium">{c.name}</p>
              <span className="text-xs text-sand">{c.specialty}</span>
            </div>
          ))}
        </div>

        <h2 className="font-serif text-2xl text-forest mb-6">Your appointments</h2>
        {appointments.length === 0 && <p className="text-sage text-sm">No appointments yet.</p>}
        <div className="flex flex-col gap-3">
          {appointments.map((a) => (
            <div key={a.appointment_id} className="flex items-center justify-between bg-mist rounded-xl px-6 py-4">
              <p className="text-forest text-sm">{new Date(a.appointment_date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${a.status === "confirmed" ? "bg-sage text-cream" : a.status === "completed" ? "bg-forest text-cream" : "bg-sand text-forest"}`}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
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

    Promise.all([
      api.get("/counselors"),
      api.get(`/appointments/${user.id}`),
    ])
      .then(([counselorsRes, appointmentsRes]) => {
        setCounselors(counselorsRes.data);
        setAppointments(appointmentsRes.data);
      })
      .catch(() => setError("Could not load counselors or appointments"))
      .finally(() => setLoading(false));
  }, [user]);

  const handleBook = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedCounselor || !date) {
      setError("Please select a counselor and a date");
      return;
    }

    setSubmitting(true);
    try {
      // user_id is read from the JWT server-side, not sent here.
      // Backend expects appointment_date, not date.
      await api.post("/appointments", {
        counselor_id: selectedCounselor,
        appointment_date: date,
        notes: "",
      });
      setSuccess("Appointment request submitted");
      setSelectedCounselor("");
      setDate("");
      // POST only returns a success message, not the created row,
      // so re-fetch to get the real appointment.
      const res = await api.get(`/appointments/${user.id}`);
      setAppointments(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Book an Appointment
      </h2>

      <form
        onSubmit={handleBook}
        className="bg-white shadow rounded-lg p-6 mb-8 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Counselor
          </label>
          <select
            value={selectedCounselor}
            onChange={(e) => setSelectedCounselor(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select a counselor</option>
            {counselors.map((c) => (
              <option key={c.counselor_id} value={c.counselor_id}>
                {c.name} — {c.specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
          {submitting ? "Booking..." : "Book appointment"}
        </button>
      </form>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Available Counselors
      </h3>
      <div className="grid gap-3 mb-8">
        {counselors.map((c) => (
          <div
            key={c.counselor_id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <p className="font-medium text-gray-800">{c.name}</p>
            <p className="text-sm text-gray-500">{c.specialty}</p>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Your Appointments
      </h3>
      {appointments.length === 0 && (
        <p className="text-gray-500">No appointments yet.</p>
      )}
      <div className="grid gap-3">
        {appointments.map((a) => (
          <div
            key={a.appointment_id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex justify-between items-center"
          >
            <span className="text-gray-700">
              {new Date(a.appointment_date).toLocaleDateString()}
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
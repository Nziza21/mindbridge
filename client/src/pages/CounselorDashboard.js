import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function CounselorDashboard() {
  const { user } = useAuth();
  const [counselor, setCounselor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      // KNOWN GAP: the `counselors` table has no link (e.g. user_id) back to
      // the `users` table a logged-in counselor account belongs to. As a
      // stopgap, we match this account to a counselor row by email. This
      // only works if a counselor's seeded/registered email exactly matches
      // their user account's email. Flagged to the team — the real fix is
      // adding a user_id column to `counselors` and looking it up directly.
      const counselorsRes = await api.get("/counselors");
      const match = counselorsRes.data.find(
        (c) => c.email?.toLowerCase() === user.email?.toLowerCase()
      );

      if (!match) {
        setError(
          "Could not find a counselor profile matching this account's email. " +
            "This is a known gap — see team notes on linking counselors to user accounts."
        );
        setLoading(false);
        return;
      }

      setCounselor(match);

      const appointmentsRes = await api.get(`/appointments/counselor/${match.counselor_id}`);
      setAppointments(appointmentsRes.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load your appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Counselor Dashboard
      </h2>
      {counselor && (
        <p className="text-sm text-gray-500 mb-6">
          {counselor.name} — {counselor.specialty}
        </p>
      )}

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Appointments booked with you
      </h3>

      {!error && appointments.length === 0 && (
        <p className="text-gray-500">No appointments booked yet.</p>
      )}

      <div className="grid gap-3">
        {appointments.map((a) => (
          <div
            key={a.appointment_id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="text-gray-800 font-medium">
                {a.student_name} —{" "}
                {new Date(a.appointment_date).toLocaleDateString()}
              </p>
              {a.notes && <p className="text-sm text-gray-500">{a.notes}</p>}
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
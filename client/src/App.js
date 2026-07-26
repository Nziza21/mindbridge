import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MoodCheckIn from "./pages/MoodCheckIn";
import Journal from "./pages/Journal";
import Resources from "./pages/Resources";
import Appointments from "./pages/Appointments";
import Feedback from "./pages/Feedback";
import CounselorDashboard from "./pages/CounselorDashboard";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";

function homeForRole(role) {
  if (role === "counselor") return "/counselor-dashboard";
  if (role === "admin") return "/admin";
  return "/dashboard";
}

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homeForRole(user.role)} />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={["student"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/mood-checkin"
            element={
              <PrivateRoute roles={["student"]}>
                <MoodCheckIn />
              </PrivateRoute>
            }
          />
          <Route
            path="/journal"
            element={
              <PrivateRoute roles={["student"]}>
                <Journal />
              </PrivateRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <PrivateRoute>
                <Resources />
              </PrivateRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <PrivateRoute roles={["student"]}>
                <Appointments />
              </PrivateRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <PrivateRoute roles={["student"]}>
                <Feedback />
              </PrivateRoute>
            }
          />
          <Route
            path="/counselor-dashboard"
            element={
              <PrivateRoute roles={["counselor"]}>
                <CounselorDashboard />
              </PrivateRoute>
            }
          />
	  <Route
            path="/admin"
            element={
              <PrivateRoute roles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
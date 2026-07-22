import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav style={{ padding: "10px", background: "#1B3A4B", display: "flex", gap: "20px" }}>
      <button onClick={() => navigate("/dashboard")} style={{ color: "white", background: "none", border: "none", cursor: "pointer" }}>Dashboard</button>
      <button onClick={() => navigate("/mood-checkin")} style={{ color: "white", background: "none", border: "none", cursor: "pointer" }}>Mood Check-in</button>
      <button onClick={() => navigate("/journal")} style={{ color: "white", background: "none", border: "none", cursor: "pointer" }}>Journal</button>
      <button onClick={() => { logout(); navigate("/"); }} style={{ color: "#A07D52", background: "none", border: "none", cursor: "pointer", marginLeft: "auto" }}>Log Out</button>
    </nav>
  );
}

export default Navbar;
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const PUBLIC_PATHS = ["/", "/login", "/register"];

  if (!user || PUBLIC_PATHS.includes(location.pathname)) return null;

  const studentLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Mood", path: "/mood-checkin" },
    { label: "Journal", path: "/journal" },
    { label: "Resources", path: "/resources" },
    { label: "Appointments", path: "/appointments" },
    { label: "Feedback", path: "/feedback" },
  ];

  const counselorLinks = [
    { label: "Counselor Dashboard", path: "/counselor-dashboard" },
    { label: "Resources", path: "/resources" },
  ];

  const adminLinks = [
    { label: "Admin Dashboard", path: "/admin" },
    { label: "Resources", path: "/resources" },
  ];

  const links =
    user.role === "counselor"
      ? counselorLinks
      : user.role === "admin"
      ? adminLinks
      : studentLinks;

  return (
    <nav className="flex justify-between items-center px-12 py-5 bg-cream border-b border-mist">
      <span className="font-serif text-xl text-forest font-medium">MindBridge</span>
      <div className="flex gap-8">
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`text-sm font-medium transition-all duration-200 ${
              location.pathname === link.path
                ? "text-forest border-b-2 border-forest pb-1"
                : "text-sage hover:text-forest"
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => { logout(); navigate("/"); }}
        className="text-sm font-medium text-sand hover:text-forest transition-all duration-200"
      >
        Log out
      </button>
    </nav>
  );
}

export default Navbar;
import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1>MindBridge</h1>
      <p>
        MindBridge is a mental health support platform built for
        international students. Track your mood, write private journal
        entries, and stay connected to your wellbeing while adjusting to
        life far from home.
      </p>

      <div className="landing-buttons">
        <button onClick={() => navigate("/login")}>Log In</button>
        <button onClick={() => navigate("/register")}>Register</button>
      </div>
    </div>
  );
}

export default Landing;

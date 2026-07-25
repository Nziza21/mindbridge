import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <p className="text-sage text-sm font-medium tracking-widest uppercase mb-2">Welcome back</p>
        <h1 className="font-serif text-4xl text-forest mb-10">Log in to MindBridge</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-mist rounded-xl px-5 py-4 text-forest text-sm placeholder-sand outline-none focus:ring-2 focus:ring-sage"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-mist rounded-xl px-5 py-4 text-forest text-sm placeholder-sand outline-none focus:ring-2 focus:ring-sage"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-forest text-cream text-sm font-medium py-4 rounded-full hover:bg-moss transition-all duration-300 mt-2"
          >
            Log in
          </button>
        </form>

        <p className="text-sage text-sm text-center mt-8">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-forest font-medium cursor-pointer hover:underline"
          >
            Register here
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;
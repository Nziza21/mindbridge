import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Select from "react-select";
import { getData } from "country-list";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", country: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const countryOptions = (getData() || []).map((c) => ({ value: c.name, label: c.name }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", { ...form, role: "student" });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <p className="text-sage text-sm font-medium tracking-widest uppercase mb-2">Get started</p>
        <h1 className="font-serif text-4xl text-forest mb-10">Create your account</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="bg-mist rounded-xl px-5 py-4 text-forest text-sm placeholder-sand outline-none focus:ring-2 focus:ring-sage"
          />
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="bg-mist rounded-xl px-5 py-4 text-forest text-sm placeholder-sand outline-none focus:ring-2 focus:ring-sage"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="bg-mist rounded-xl px-5 py-4 text-forest text-sm placeholder-sand outline-none focus:ring-2 focus:ring-sage"
          />

          <Select
            options={countryOptions}
            onChange={(selected) => setForm({ ...form, country: selected?.value || "" })}
            placeholder="Country of origin"
            styles={{
              control: (base) => ({
                ...base,
                background: "#E8EDE9",
                border: "none",
                borderRadius: "12px",
                padding: "8px 8px",
                boxShadow: "none",
              }),
              placeholder: (base) => ({ ...base, color: "#C8B89A", fontSize: "14px" }),
              singleValue: (base) => ({ ...base, color: "#1C2B1E", fontSize: "14px" }),
            }}
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-forest text-cream text-sm font-medium py-4 rounded-full hover:bg-moss transition-all duration-300 mt-2"
          >
            Create account
          </button>
        </form>

        <p className="text-sage text-sm text-center mt-8">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-forest font-medium cursor-pointer hover:underline"
          >
            Log in here
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;
import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      
      {/* Nav */}
      <nav className="flex justify-between items-center px-12 py-6">
        <span className="font-serif text-2xl text-forest font-medium">MindBridge</span>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="text-forest text-sm font-medium px-5 py-2 rounded-full border border-forest hover:bg-forest hover:text-cream transition-all duration-300"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="text-cream text-sm font-medium px-5 py-2 rounded-full bg-forest hover:bg-moss transition-all duration-300"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <p className="text-sage text-sm font-medium tracking-widest uppercase mb-6">
          Mental wellness for students abroad
        </p>
        <h1 className="font-serif text-6xl text-forest leading-tight max-w-3xl mb-6">
          A quiet space to feel like yourself again
        </h1>
        <p className="text-moss text-lg max-w-xl leading-relaxed mb-12">
          MindBridge connects international students with licensed therapists, daily mood tracking, and a private journal — all in one calm, secure space.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="bg-forest text-cream text-sm font-medium px-8 py-4 rounded-full hover:bg-moss transition-all duration-300"
        >
          Start your journey
        </button>
      </main>

      {/* Features */}
      <section className="grid grid-cols-3 gap-6 px-12 pb-24">
        {[
          { title: "Mood tracking", desc: "Check in daily and watch your emotional patterns emerge over time." },
          { title: "Private journal", desc: "Write freely with prompts that meet you where you are." },
          { title: "Real therapists", desc: "Book sessions with licensed Rwandan mental health professionals." },
        ].map((f) => (
          <div key={f.title} className="bg-mist rounded-2xl p-8">
            <h3 className="font-serif text-xl text-forest mb-3">{f.title}</h3>
            <p className="text-moss text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center pb-8 text-sand text-xs">
        MindBridge © 2025 · African Leadership University · Built by The Nerds
      </footer>

    </div>
  );
}

export default Landing;
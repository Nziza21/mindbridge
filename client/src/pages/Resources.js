import { useEffect, useState } from "react";
import api from "../services/api";

const CATEGORIES = ["All", "Anxiety", "Depression", "Stress", "Sleep", "Academics", "Mindfulness", "Social"];

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const endpoint = activeCategory === "All" ? "/resources" : "/resources/" + activeCategory.toLowerCase();
    api.get(endpoint)
      .then((res) => setResources(res.data))
      .catch(() => setError("Could not load resources"))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-cream px-12 py-10">
      <div className="max-w-4xl mx-auto">
        <p className="text-sage text-sm font-medium tracking-widest uppercase mb-2">Mental health</p>
        <h1 className="font-serif text-4xl text-forest mb-8">Resource Library</h1>
        <div className="flex flex-wrap gap-3 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? "px-4 py-2 rounded-full text-sm font-medium bg-forest text-cream" : "px-4 py-2 rounded-full text-sm font-medium bg-mist text-moss"}
            >
              {cat}
            </button>
          ))}
        </div>
        {loading && <p className="text-sage text-sm">Loading...</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {!loading && resources.length === 0 && <p className="text-sage text-sm">No resources found.</p>}
        <div className="grid grid-cols-2 gap-4">
          {resources.map((r) => (
            <div key={r.resource_id} className="bg-mist rounded-2xl p-6">
              <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-forest text-cream mb-3">{r.category}</span>
              <h3 className="font-serif text-lg text-forest mb-2">{r.title}</h3>
              <p className="text-moss text-sm leading-relaxed mb-4">{r.description}</p>
              {r.url && (
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-sage text-sm font-medium">
                  View resource
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
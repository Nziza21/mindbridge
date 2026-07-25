import { useEffect, useState } from "react";
import api from "../services/api";

const CATEGORIES = ["All", "Anxiety", "Depression", "Stress", "Sleep", "Academics"];

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    const endpoint =
      activeCategory === "All"
        ? "/resources"
        : `/resources/${activeCategory.toLowerCase()}`;

    api
      .get(endpoint)
      .then((res) => setResources(res.data))
      .catch(() => setError("Could not load resources"))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Resource Library
      </h2>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && resources.length === 0 && (
        <p className="text-gray-500">No resources found in this category.</p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {resources.map((r) => (
          <div
            key={r.resource_id}
            className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition"
          >
            <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 mb-2">
              {r.category}
            </span>
            <h3 className="font-semibold text-gray-800 mb-1">{r.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{r.description}</p>
            {r.url && (
              
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                View resource →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
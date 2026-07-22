import React, { useState, useEffect } from "react";
import api from "../services/api";

function Journal() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const token = localStorage.getItem("token");

  const fetchEntries = async () => {
    try {
      const userId = JSON.parse(atob(token.split(".")[1])).id;
      const res = await api.get(`/journal/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/journal", { title, content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitle("");
      setContent("");
      fetchEntries();
    } catch (err) {
      alert("Failed to save entry");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/journal/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEntries();
    } catch (err) {
      alert("Failed to delete entry");
    }
  };

  return (
    <div>
      <h2>My Journal</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Write your thoughts..." value={content} onChange={(e) => setContent(e.target.value)} required />
        <button type="submit">Save Entry</button>
      </form>
      <h3>Past Entries</h3>
      {entries.map((entry) => (
        <div key={entry.journal_id}>
          <h4>{entry.title}</h4>
          <p>{entry.content}</p>
          <small>{new Date(entry.date).toLocaleDateString()}</small>
          <button onClick={() => handleDelete(entry.journal_id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Journal;
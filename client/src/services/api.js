import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// attach token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);

// Journal entries
// entryData: { title, content, mood_id } — user_id comes from the JWT server-side
export const createJournalEntry = (entryData) => api.post("/journal", entryData);
export const getJournalEntries = (userId) => api.get(`/journal/${userId}`);
export const deleteJournalEntry = (journalId) => api.delete(`/journal/${journalId}`);

export default api;
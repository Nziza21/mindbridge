const db = require('../config/db');

const createMoodEntry = (user_id, mood_level, notes, callback) => {
  const sql = 'INSERT INTO mood_entries (user_id, mood_level, notes) VALUES (?, ?, ?)';
  db.query(sql, [user_id, mood_level, notes], callback);
};

const getMoodsByUser = (user_id, callback) => {
  const sql = 'SELECT * FROM mood_entries WHERE user_id = ? ORDER BY date DESC';
  db.query(sql, [user_id], callback);
};

module.exports = { createMoodEntry, getMoodsByUser };
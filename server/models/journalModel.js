const db = require('../config/db');

const createJournalEntry = (user_id, title, content, mood_id, callback) => {
  const sql = 'INSERT INTO journal (user_id, title, content, mood_id) VALUES (?, ?, ?, ?)';
  // mood_id is optional — coerce undefined to null so mysql2 doesn't throw
  db.query(sql, [user_id, title, content, mood_id || null], callback);
};

const getJournalsByUser = (user_id, callback) => {
  const sql = 'SELECT * FROM journal WHERE user_id = ? ORDER BY created_at DESC';
  db.query(sql, [user_id], callback);
};

const deleteJournalEntry = (journal_id, callback) => {
  const sql = 'DELETE FROM journal WHERE journal_id = ?';
  db.query(sql, [journal_id], callback);
};

module.exports = { createJournalEntry, getJournalsByUser, deleteJournalEntry };

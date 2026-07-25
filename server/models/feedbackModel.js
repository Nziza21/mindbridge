const db = require('../config/db');

const createFeedback = (user_id, rating, comments, callback) => {
  const sql = 'INSERT INTO feedback (user_id, rating, comments) VALUES (?, ?, ?)';
  db.query(sql, [user_id, rating, comments], callback);
};

const getAllFeedback = (callback) => {
  const sql = 'SELECT * FROM feedback ORDER BY date DESC';
  db.query(sql, callback);
};

module.exports = { createFeedback, getAllFeedback };
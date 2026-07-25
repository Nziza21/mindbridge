const db = require('../config/db');

const getAllCounselors = (callback) => {
  const sql = 'SELECT * FROM counselors';
  db.query(sql, callback);
};

const getCounselorById = (counselor_id, callback) => {
  const sql = 'SELECT * FROM counselors WHERE counselor_id = ?';
  db.query(sql, [counselor_id], callback);
};

const createCounselor = (name, email, specialty, bio, callback) => {
  const sql = 'INSERT INTO counselors (name, email, specialty, bio) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, specialty, bio], callback);
};

module.exports = { getAllCounselors, getCounselorById, createCounselor };

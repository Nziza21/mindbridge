const db = require('../config/db');

const getCounselors = (req, res) => {
  const sql = 'SELECT * FROM counselors';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

module.exports = { getCounselors };
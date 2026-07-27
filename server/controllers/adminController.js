const db = require('../config/db');

const getAdminData = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  db.query('SELECT user_id, name, email, role, country FROM users', (err, users) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    db.query('SELECT COUNT(*) AS total FROM appointments', (err2, appointments) => {
      if (err2) return res.status(500).json({ message: 'Server error' });

      db.query('SELECT COUNT(*) AS total FROM mood_entries', (err3, moods) => {
        if (err3) return res.status(500).json({ message: 'Server error' });

        res.json({
          users,
          totalAppointments: appointments[0].total,
          totalMoods: moods[0].total,
        });
      });
    });
  });
};

const bcrypt = require('bcryptjs');

const createCounselor = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { name, email, password, specialization } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, 'counselor'],
    (err, result) => {
      if (err) {
        console.error('Users insert error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      const userId = result.insertId;

      db.query(
        'INSERT INTO counselors (name, email, specialty) VALUES (?, ?, ?)',
        [name, email, specialization],
        (err2) => {
          if (err2) {
            console.error('Counselors insert error:', err2);
            return res.status(500).json({ message: 'Server error' });
          }
          res.status(201).json({ message: 'Counselor created successfully' });
        }
      );
    }
  );
};

module.exports = { getAdminData };
module.exports = { getAdminData, createCounselor };
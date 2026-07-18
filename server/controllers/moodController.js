const { createMoodEntry, getMoodsByUser } = require('../models/moodModel');

const addMood = (req, res) => {
  const { mood_level, notes } = req.body;
  const user_id = req.user.id;

  createMoodEntry(user_id, mood_level, notes, (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.status(201).json({ message: 'Mood entry saved successfully' });
  });
};

const getMoods = (req, res) => {
  const user_id = req.params.userId;

  getMoodsByUser(user_id, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

module.exports = { addMood, getMoods };
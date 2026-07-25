const { createFeedback, getAllFeedback } = require('../models/feedbackModel');

const addFeedback = (req, res) => {
  const { rating, comments } = req.body;
  const user_id = req.user.id;

  createFeedback(user_id, rating, comments, (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.status(201).json({ message: 'Feedback submitted successfully' });
  });
};

const getFeedback = (req, res) => {
  getAllFeedback((err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

module.exports = { addFeedback, getFeedback };
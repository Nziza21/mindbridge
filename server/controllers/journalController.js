const { createJournalEntry, getJournalsByUser, deleteJournalEntry } = require('../models/journalModel');

const addJournal = (req, res) => {
  const { title, content, mood_id } = req.body;
  const user_id = req.user.id;

  createJournalEntry(user_id, title, content, mood_id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.status(201).json({ message: 'Journal entry saved successfully' });
  });
};

const getJournals = (req, res) => {
  const user_id = req.params.userId;

  getJournalsByUser(user_id, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

const deleteJournal = (req, res) => {
  const journal_id = req.params.journalId;

  deleteJournalEntry(journal_id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Journal entry deleted successfully' });
  });
};

module.exports = { addJournal, getJournals, deleteJournal };

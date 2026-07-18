const express = require('express');
const router = express.Router();
const { addJournal, getJournals, deleteJournal } = require('../controllers/journalController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, addJournal);
router.get('/:userId', verifyToken, getJournals);
router.delete('/:journalId', verifyToken, deleteJournal);

module.exports = router;

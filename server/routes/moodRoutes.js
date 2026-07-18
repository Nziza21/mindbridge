const express = require('express');
const router = express.Router();
const { addMood, getMoods } = require('../controllers/moodController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, addMood);
router.get('/:userId', verifyToken, getMoods);

module.exports = router;
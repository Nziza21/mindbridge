const express = require('express');
const router = express.Router();
const { addFeedback, getFeedback } = require('../controllers/feedbackController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, addFeedback);
router.get('/', verifyToken, getFeedback);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getCounselors } = require('../controllers/counselorController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, getCounselors);

module.exports = router;
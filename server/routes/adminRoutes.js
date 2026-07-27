const express = require('express');
const router = express.Router();
const { getAdminData, createCounselor } = require('../controllers/adminController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAdminData);
router.post('/create-counselor', verifyToken, createCounselor);

module.exports = router;
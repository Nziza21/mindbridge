const express = require('express');
const router = express.Router();
const { getResources, getResourcesByCategoryHandler } = require('../controllers/resourceController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, getResources);
router.get('/:category', verifyToken, getResourcesByCategoryHandler);

module.exports = router;

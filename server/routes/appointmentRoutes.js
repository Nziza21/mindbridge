const express = require('express');
const router = express.Router();
const { addAppointment, getAppointments } = require('../controllers/appointmentController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, addAppointment);
router.get('/:userId', verifyToken, getAppointments);

module.exports = router;
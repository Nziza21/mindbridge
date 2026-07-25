const express = require('express');
const router = express.Router();
const { addAppointment, getAppointments, getAppointmentsByCounselor } = require('../controllers/appointmentController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, addAppointment);
router.get('/counselor/:counselorId', verifyToken, getAppointmentsByCounselor);
router.get('/:userId', verifyToken, getAppointments);

module.exports = router;
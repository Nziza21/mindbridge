const db = require('../config/db');
const { createAppointment, getAppointmentsByUser } = require('../models/appointmentModel');

const addAppointment = (req, res) => {
  const { counselor_id, appointment_date, notes } = req.body;
  const user_id = req.user.id;

  createAppointment(user_id, counselor_id, appointment_date, notes, (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.status(201).json({ message: 'Appointment booked successfully' });
  });
};

const getAppointments = (req, res) => {
  const user_id = req.params.userId;

  getAppointmentsByUser(user_id, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

const getAppointmentsByCounselor = (req, res) => {
  const counselor_id = req.params.counselorId;

  db.query(
    'SELECT a.*, u.name AS student_name FROM appointments a JOIN users u ON a.user_id = u.user_id WHERE a.counselor_id = ? ORDER BY a.appointment_date DESC',
    [counselor_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    }
  );
};

module.exports = { addAppointment, getAppointments, getAppointmentsByCounselor };
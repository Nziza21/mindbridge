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

module.exports = { addAppointment, getAppointments };
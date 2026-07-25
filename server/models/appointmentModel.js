const db = require('../config/db');

const createAppointment = (user_id, counselor_id, appointment_date, notes, callback) => {
  const sql = 'INSERT INTO appointments (user_id, counselor_id, appointment_date, notes) VALUES (?, ?, ?, ?)';
  db.query(sql, [user_id, counselor_id, appointment_date, notes], callback);
};

// Student's own booked appointments
const getAppointmentsByUser = (user_id, callback) => {
  const sql = 'SELECT * FROM appointments WHERE user_id = ? ORDER BY appointment_date DESC';
  db.query(sql, [user_id], callback);
};

// Counselor's incoming appointments
const getAppointmentsByCounselor = (counselor_id, callback) => {
  const sql = 'SELECT * FROM appointments WHERE counselor_id = ? ORDER BY appointment_date ASC';
  db.query(sql, [counselor_id], callback);
};

// status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
const updateAppointmentStatus = (appointment_id, status, callback) => {
  const sql = 'UPDATE appointments SET status = ? WHERE appointment_id = ?';
  db.query(sql, [status, appointment_id], callback);
};

module.exports = {
  createAppointment,
  getAppointmentsByUser,
  getAppointmentsByCounselor,
  updateAppointmentStatus,
};

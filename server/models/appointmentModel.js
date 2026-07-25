const db = require('../config/db');

const createAppointment = (user_id, counselor_id, appointment_date, notes, callback) => {
  const sql = 'INSERT INTO appointments (user_id, counselor_id, appointment_date, notes) VALUES (?, ?, ?, ?)';
  db.query(sql, [user_id, counselor_id, appointment_date, notes], callback);
};

const getAppointmentsByUser = (user_id, callback) => {
  const sql = `
    SELECT a.*, c.name AS counselor_name, c.specialty
    FROM appointments a
    JOIN counselors c ON a.counselor_id = c.counselor_id
    WHERE a.user_id = ?
    ORDER BY a.appointment_date DESC
  `;
  db.query(sql, [user_id], callback);
};

module.exports = { createAppointment, getAppointmentsByUser };
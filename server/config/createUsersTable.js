// server/config/createUsersTable.js
//
// One-time script to create the users table on a fresh database.
// Run from the server/ folder: node config/createUsersTable.js

const db = require('./db');

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

db.query(createUsersTable, (err) => {
  if (err) {
    console.error('Failed to create users table:', err);
  } else {
    console.log('users table created (or already existed)');
  }
  db.end();
});
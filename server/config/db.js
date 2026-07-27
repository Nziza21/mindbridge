const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Use the CA cert from an env var if present (Render), otherwise read the local file
const caCert = process.env.DB_CA_CERT
  ? process.env.DB_CA_CERT
  : fs.readFileSync(path.join(__dirname, 'ca.pem'));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: caCert,
    rejectUnauthorized: true
  }
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('MySQL connected');
});

module.exports = db;
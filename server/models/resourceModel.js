const db = require('../config/db');

const getAllResources = (callback) => {
  const sql = 'SELECT * FROM resources';
  db.query(sql, callback);
};

const getResourcesByCategory = (category, callback) => {
  const sql = 'SELECT * FROM resources WHERE category = ?';
  db.query(sql, [category], callback);
};

const createResource = (title, type, category, description, url, callback) => {
  const sql = 'INSERT INTO resources (title, type, category, description, url) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [title, type, category, description, url], callback);
};

const deleteResource = (resource_id, callback) => {
  const sql = 'DELETE FROM resources WHERE resource_id = ?';
  db.query(sql, [resource_id], callback);
};

module.exports = { getAllResources, getResourcesByCategory, createResource, deleteResource };

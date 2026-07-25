const { getAllResources, getResourcesByCategory } = require('../models/resourceModel');

const getResources = (req, res) => {
  getAllResources((err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

const getResourcesByCategoryHandler = (req, res) => {
  const category = req.params.category;

  getResourcesByCategory(category, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

module.exports = { getResources, getResourcesByCategoryHandler };

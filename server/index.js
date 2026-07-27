const express = require('express');
const cors = require('cors');
require('dotenv').config();
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');
const journalRoutes = require('./routes/journalRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const counselorRoutes = require('./routes/counselorRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const app = express();
const adminRoutes = require('./routes/adminRoutes');


app.use(cors({
  origin: ['https://mindbridge-navy-tau.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/counselors', counselorRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'MindBridge API running' });
});
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

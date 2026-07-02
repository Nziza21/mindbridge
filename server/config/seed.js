// server/config/seed.js


const db = require('./db');

const createCounselorsTable = `
  CREATE TABLE IF NOT EXISTS counselors (
    counselor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    specialty VARCHAR(100),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const createResourcesTable = `
  CREATE TABLE IF NOT EXISTS resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    type VARCHAR(50),
    category VARCHAR(50),
    description TEXT,
    url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const counselors = [
  ['Dr. Aurore IRAKARAMA', 'a.irakarama1@mindbridge.com', 'Anxiety & Stress', 'Specializes in helping students manage academic stress and anxiety.'],
  ['Dr. NZIZA Samuel', 'n.samuel@mindbridge.com', 'Depression', 'Focuses on mood disorders and building healthy coping strategies.'],
  ['Dr. Uwase Huguette', 'u.huguette@mindbridge.com', 'Academic Pressure', 'Works with students on burnout, motivation, and time management.'],
];

const resources = [
  ['5 Ways to Manage Exam Stress', 'article', 'stress', 'Practical tips for staying calm during exam season.', 'https://example.com/exam-stress'],
  ['Understanding Anxiety', 'video', 'anxiety', 'A short video explaining what anxiety is and how it shows up.', 'https://example.com/anxiety-video'],
  ['Building a Daily Mindfulness Habit', 'article', 'mindfulness', 'Simple steps to start a mindfulness practice.', 'https://example.com/mindfulness-habit'],
  ['Coping with Depression as a Student', 'article', 'depression', 'Signs to watch for and where to get support.', 'https://example.com/depression-students'],
  ['Quick Breathing Exercise', 'video', 'stress', 'A 3-minute guided breathing exercise for stressful moments.', 'https://example.com/breathing-exercise'],
];

function run() {
  db.query(createCounselorsTable, (err) => {
    if (err) {
      console.error('Error creating counselors table:', err);
      db.end();
      return;
    }
    console.log('counselors table ready');

    db.query(createResourcesTable, (err) => {
      if (err) {
        console.error('Error creating resources table:', err);
        db.end();
        return;
      }
      console.log('resources table ready');
      insertCounselors();
    });
  });
}

function insertCounselors() {
  db.query('SELECT COUNT(*) AS count FROM counselors', (err, rows) => {
    if (err) {
      console.error('Error checking counselors:', err);
      db.end();
      return;
    }
    if (rows[0].count > 0) {
      console.log('counselors already has data, skipping insert');
      insertResources();
      return;
    }
    const sql = 'INSERT INTO counselors (name, email, specialty, bio) VALUES ?';
    db.query(sql, [counselors], (err, result) => {
      if (err) {
        console.error('Error seeding counselors:', err);
        db.end();
        return;
      }
      console.log(`Inserted ${result.affectedRows} counselors`);
      insertResources();
    });
  });
}

function insertResources() {
  db.query('SELECT COUNT(*) AS count FROM resources', (err, rows) => {
    if (err) {
      console.error('Error checking resources:', err);
      db.end();
      return;
    }
    if (rows[0].count > 0) {
      console.log('resources already has data, skipping insert');
      db.end();
      return;
    }
    const sql = 'INSERT INTO resources (title, type, category, description, url) VALUES ?';
    db.query(sql, [resources], (err, result) => {
      if (err) {
        console.error('Error seeding resources:', err);
        db.end();
        return;
      }
      console.log(`Inserted ${result.affectedRows} resources`);
      db.end();
    });
  });
}

run();

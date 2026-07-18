// server/config/seed.js
// Creates counselors, resources, mood_entries, and journal tables (if they
// don't exist yet) and fills them with sample data.
// Run from the server/ folder with: node config/seed.js
//
// NOTE: mood_entries and journal both reference user_id. Since the `users`
// table already exists (created outside this script), we assume at least
// one or two test users have been registered already (e.g. via
// POST /api/auth/register) with ids 1 and 2. If your test users have
// different ids, just adjust the `user_id` values in moodEntries below.

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

// Name matches what moodModel.js already queries: mood_entries, with
// columns user_id, mood_level, notes, date.
const createMoodEntriesTable = `
  CREATE TABLE IF NOT EXISTS mood_entries (
    mood_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mood_level INT NOT NULL,
    notes TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

// mood_id is nullable — an entry can exist with no mood check-in attached.
// ON DELETE SET NULL means deleting a mood entry won't break the journal
// entry, it just unlinks it.
const createJournalTable = `
  CREATE TABLE IF NOT EXISTS journal (
    journal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150),
    content TEXT NOT NULL,
    mood_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mood_id) REFERENCES mood_entries(mood_id) ON DELETE SET NULL
  )
`;

const counselors = [
  ['Dr. Aline Uwase', 'aline.uwase@mindbridge.com', 'Anxiety & Stress', 'Specializes in helping students manage academic stress and anxiety.'],
  ['Dr. Eric Mugisha', 'eric.mugisha@mindbridge.com', 'Depression', 'Focuses on mood disorders and building healthy coping strategies.'],
  ['Dr. Sandrine Ingabire', 'sandrine.ingabire@mindbridge.com', 'Academic Pressure', 'Works with students on burnout, motivation, and time management.'],
];

const resources = [
  ['5 Ways to Manage Exam Stress', 'article', 'stress', 'Practical tips for staying calm during exam season.', 'https://example.com/exam-stress'],
  ['Understanding Anxiety', 'video', 'anxiety', 'A short video explaining what anxiety is and how it shows up.', 'https://example.com/anxiety-video'],
  ['Building a Daily Mindfulness Habit', 'article', 'mindfulness', 'Simple steps to start a mindfulness practice.', 'https://example.com/mindfulness-habit'],
  ['Coping with Depression as a Student', 'article', 'depression', 'Signs to watch for and where to get support.', 'https://example.com/depression-students'],
  ['Quick Breathing Exercise', 'video', 'stress', 'A 3-minute guided breathing exercise for stressful moments.', 'https://example.com/breathing-exercise'],
];

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

// 5 rows, in this exact order — journalEntries below link back to these
// by position (row 1 = first insertId, row 2 = insertId + 1, etc.)
const moodEntries = [
  [1, 7, 'Felt good after finishing my assignment early.', daysAgo(4)],
  [1, 4, 'Stressed about the upcoming exam.', daysAgo(3)],
  [1, 8, 'Had a great study session with friends.', daysAgo(1)],
  [2, 3, "Anxious about tomorrow's presentation.", daysAgo(2)],
  [2, 6, 'Slept better last night, feeling okay.', daysAgo(0)],
];

function fail(step, err) {
  console.error(`Error ${step}:`, err);
  db.end();
}

function run() {
  db.query(createCounselorsTable, (err) => {
    if (err) return fail('creating counselors table', err);
    console.log('counselors table ready');

    db.query(createResourcesTable, (err) => {
      if (err) return fail('creating resources table', err);
      console.log('resources table ready');

      db.query(createMoodEntriesTable, (err) => {
        if (err) return fail('creating mood_entries table', err);
        console.log('mood_entries table ready');

        db.query(createJournalTable, (err) => {
          if (err) return fail('creating journal table', err);
          console.log('journal table ready');
          insertCounselors();
        });
      });
    });
  });
}

function insertCounselors() {
  db.query('SELECT COUNT(*) AS count FROM counselors', (err, rows) => {
    if (err) return fail('checking counselors', err);
    if (rows[0].count > 0) {
      console.log('counselors already has data, skipping insert');
      return insertResources();
    }
    const sql = 'INSERT INTO counselors (name, email, specialty, bio) VALUES ?';
    db.query(sql, [counselors], (err, result) => {
      if (err) return fail('seeding counselors', err);
      console.log(`Inserted ${result.affectedRows} counselors`);
      insertResources();
    });
  });
}

function insertResources() {
  db.query('SELECT COUNT(*) AS count FROM resources', (err, rows) => {
    if (err) return fail('checking resources', err);
    if (rows[0].count > 0) {
      console.log('resources already has data, skipping insert');
      return insertMoodEntries();
    }
    const sql = 'INSERT INTO resources (title, type, category, description, url) VALUES ?';
    db.query(sql, [resources], (err, result) => {
      if (err) return fail('seeding resources', err);
      console.log(`Inserted ${result.affectedRows} resources`);
      insertMoodEntries();
    });
  });
}

function insertMoodEntries() {
  db.query('SELECT COUNT(*) AS count FROM mood_entries', (err, rows) => {
    if (err) return fail('checking mood_entries', err);
    if (rows[0].count > 0) {
      console.log('mood_entries already has data, skipping insert (journal entries will have no mood_id links)');
      return insertJournalEntries(null);
    }
    const sql = 'INSERT INTO mood_entries (user_id, mood_level, notes, date) VALUES ?';
    db.query(sql, [moodEntries], (err, result) => {
      if (err) return fail('seeding mood_entries', err);
      console.log(`Inserted ${result.affectedRows} mood entries`);
      // MySQL guarantees consecutive auto-increment ids for a single
      // multi-row INSERT, starting at result.insertId
      insertJournalEntries(result.insertId);
    });
  });
}

function insertJournalEntries(firstMoodId) {
  db.query('SELECT COUNT(*) AS count FROM journal', (err, rows) => {
    if (err) return fail('checking journal', err);
    if (rows[0].count > 0) {
      console.log('journal already has data, skipping insert');
      db.end();
      return;
    }

    const m = firstMoodId; // shorthand
    const journalEntries = [
      [1, 'Rough day', 'Today was tough, exam stress is real.', m ? m + 1 : null],
      [1, 'Good study session', 'Studied with friends and it really helped my mood.', m ? m + 2 : null],
      [1, 'Random thoughts', 'Just wanted to write something down, not tied to a specific mood check-in.', null],
      [2, 'Presentation nerves', "Feeling anxious about tomorrow's presentation.", m ? m + 3 : null],
      [2, 'Better night', 'Slept well, feeling a bit more at ease.', m ? m + 4 : null],
    ];

    const sql = 'INSERT INTO journal (user_id, title, content, mood_id) VALUES ?';
    db.query(sql, [journalEntries], (err, result) => {
      if (err) return fail('seeding journal', err);
      console.log(`Inserted ${result.affectedRows} journal entries`);
      db.end();
    });
  });
}

run();

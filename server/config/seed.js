// server/config/seed.js
//
// FINAL seed script. Drops and rebuilds: counselors, resources,
// mood_entries, appointments, journal — with proper foreign keys between
// them. Does NOT touch the `users` table.
//
// ASSUMPTION: the `users` table's primary key column is `user_id`
// (matches the naming convention used everywhere else: counselor_id,
// resource_id, mood_id, etc). If yours is different, run `DESCRIBE users;`
// and swap `user_id` inside the two `REFERENCES users(user_id)` lines below.
//
// ASSUMPTION: test users with user_id 1 and 2 already exist (register them
// via POST /api/auth/register first if not). Adjust the sample data below
// if your ids differ.
//
// Run from the server/ folder: node config/seed.js

const db = require('./db');
const util = require('util');
const query = util.promisify(db.query).bind(db);

// ---------- table definitions ----------

const createCounselorsTable = `
  CREATE TABLE counselors (
    counselor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    specialty VARCHAR(100),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const createResourcesTable = `
  CREATE TABLE resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    type VARCHAR(50),
    category VARCHAR(50),
    description TEXT,
    url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const createMoodEntriesTable = `
  CREATE TABLE mood_entries (
    mood_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mood_level INT NOT NULL,
    notes TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
  )
`;

const createAppointmentsTable = `
  CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    counselor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (counselor_id) REFERENCES counselors(counselor_id) ON DELETE CASCADE
  )
`;

const createJournalTable = `
  CREATE TABLE journal (
    journal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150),
    content TEXT NOT NULL,
    mood_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (mood_id) REFERENCES mood_entries(mood_id) ON DELETE SET NULL
  )
`;

// ---------- sample data ----------

const counselors = [
  ['Dr. Aline Uwase', 'aline.uwase@mindbridge.com', 'Anxiety & Stress', 'Specializes in helping students manage academic stress and anxiety.'],
  ['Dr. Eric Mugisha', 'eric.mugisha@mindbridge.com', 'Depression', 'Focuses on mood disorders and building healthy coping strategies.'],
  ['Dr. Sandrine Ingabire', 'sandrine.ingabire@mindbridge.com', 'Academic Pressure', 'Works with students on burnout, motivation, and time management.'],
  ['Dr. Patrick Nsengiyumva', 'patrick.nsen@mindbridge.com', 'Relationships & Social Issues', 'Helps students navigate friendships, relationships, and social anxiety.'],
];

const resources = [
  ['5 Ways to Manage Exam Stress', 'article', 'stress', 'Practical tips for staying calm during exam season.', 'https://example.com/exam-stress'],
  ['Understanding Anxiety', 'video', 'anxiety', 'A short video explaining what anxiety is and how it shows up.', 'https://example.com/anxiety-video'],
  ['Building a Daily Mindfulness Habit', 'article', 'mindfulness', 'Simple steps to start a mindfulness practice.', 'https://example.com/mindfulness-habit'],
  ['Coping with Depression as a Student', 'article', 'depression', 'Signs to watch for and where to get support.', 'https://example.com/depression-students'],
  ['Quick Breathing Exercise', 'video', 'stress', 'A 3-minute guided breathing exercise for stressful moments.', 'https://example.com/breathing-exercise'],
  ['Navigating College Friendships', 'article', 'social', 'Tips for building and maintaining healthy friendships at university.', 'https://example.com/college-friendships'],
];

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};
const daysFromNow = (n) => daysAgo(-n);

// 8 rows, in this exact order — journal entries below link back to these
// by position offset from the first insertId. Keep user_id aligned between
// a journal entry and the mood entry it links to.
const moodEntries = [
  [1, 7, 'Felt good after finishing my assignment early.', daysAgo(6)],   // +0
  [1, 4, 'Stressed about the upcoming exam.', daysAgo(5)],                // +1
  [1, 8, 'Had a great study session with friends.', daysAgo(3)],          // +2
  [1, 6, 'Feeling okay today, nothing major.', daysAgo(1)],               // +3
  [2, 3, "Anxious about tomorrow's presentation.", daysAgo(4)],           // +4
  [2, 6, 'Slept better last night, feeling okay.', daysAgo(2)],           // +5
  [2, 5, 'Neutral day, just going through the motions.', daysAgo(1)],     // +6
  [2, 8, 'Presentation went well! Big relief.', daysAgo(0)],              // +7
];

const appointments = [
  [1, 1, daysFromNow(3), 'confirmed', 'First session, general check-in.'],
  [1, 2, daysFromNow(7), 'pending', 'Wants to talk about exam anxiety.'],
  [2, 1, daysAgo(4), 'completed', 'Discussed stress management techniques.'],
  [2, 3, daysFromNow(2), 'pending', 'First-time booking, academic pressure support.'],
  [1, 4, daysAgo(10), 'cancelled', 'Had to reschedule due to a scheduling conflict.'],
];

function buildJournalEntries(firstMoodId) {
  const m = firstMoodId;
  return [
    [1, 'Rough day', 'Today was tough, exam stress is real.', m ? m + 1 : null],
    [1, 'Good study session', 'Studied with friends and it really helped my mood.', m ? m + 2 : null],
    [1, 'Random thoughts', 'Just wanted to write something down, not tied to a specific mood check-in.', null],
    [2, 'Presentation nerves', "Feeling anxious about tomorrow's presentation.", m ? m + 4 : null],
    [2, 'Presentation went great', 'So relieved it is over, I did better than expected.', m ? m + 7 : null],
  ];
}

// ---------- run ----------

async function run() {
  try {
    // Drop child-to-parent so foreign keys don't block the drop
    await query('DROP TABLE IF EXISTS journal');
    await query('DROP TABLE IF EXISTS appointments');
    await query('DROP TABLE IF EXISTS mood_entries');
    await query('DROP TABLE IF EXISTS resources');
    await query('DROP TABLE IF EXISTS counselors');
    console.log('Old tables dropped');

    // Create parent-to-child
    await query(createCounselorsTable);
    await query(createResourcesTable);
    await query(createMoodEntriesTable);
    await query(createAppointmentsTable);
    await query(createJournalTable);
    console.log('All tables created with foreign keys');

    await query('INSERT INTO counselors (name, email, specialty, bio) VALUES ?', [counselors]);
    console.log(`Inserted ${counselors.length} counselors`);

    await query('INSERT INTO resources (title, type, category, description, url) VALUES ?', [resources]);
    console.log(`Inserted ${resources.length} resources`);

    const moodResult = await query('INSERT INTO mood_entries (user_id, mood_level, notes, date) VALUES ?', [moodEntries]);
    console.log(`Inserted ${moodEntries.length} mood entries`);

    await query('INSERT INTO appointments (user_id, counselor_id, appointment_date, status, notes) VALUES ?', [appointments]);
    console.log(`Inserted ${appointments.length} appointments`);

    const journalEntries = buildJournalEntries(moodResult.insertId);
    await query('INSERT INTO journal (user_id, title, content, mood_id) VALUES ?', [journalEntries]);
    console.log(`Inserted ${journalEntries.length} journal entries`);

    console.log('Seed complete');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    db.end();
  }
}

run();

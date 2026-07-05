# MindBridge

MindBridge is a student wellness platform with journaling, mood check-ins, and access to counselors and resources. This backend provides authentication and data storage for the app.

## Tech Stack

- **Backend:** Node.js + Express
- **Database:** MySQL
- **Auth:** JWT (JSON Web Tokens)

## Prerequisites

Before you start, make sure you have installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [MySQL](https://dev.mysql.com/downloads/) (v8 or later recommended)
- npm (comes bundled with Node.js)
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Nziza21/mindbridge.git
cd mindbridge/server
```

### 2. Install dependencies

```bash
npm install
```

Dependencies used: `express`, `mysql2`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`.

### 3. Set up the database

1. Open MySQL and create a database:

```sql
CREATE DATABASE mindbridge;
```

2. `server/config/db.js` connects using environment variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) — see step 4 below. No manual edits needed as long as your `.env` is set correctly.

### 4. Configure environment variables

Create a `.env` file inside the `server/` folder:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mindbridge
JWT_SECRET=your_jwt_secret
```

> Note: a `.env` file currently exists in the repo itself. Ideally this should be removed from version control and each teammate should keep their own local copy — committing real credentials is a security risk.

### 5. Seed sample data

`config/seed.js` creates the `counselors` and `resources` tables (if they don't exist) and inserts sample data — 3 sample counselors and 5 sample resources. Run it from inside `server/`:

```bash
node config/seed.js
```

This gives the frontend something to display during development. Safe to re-run — it skips inserting if data already exists.

### 6. Run the server

```bash
npm start
```

By default the server runs on `http://localhost:5000` (or whatever `PORT` you set in `.env`). You should see `MySQL connected` and `Server running on port 5000` in the console.

## API Endpoints

| Method | Endpoint | Description                          |
|--------|----------|----------------------------------------|
| GET    | `/`      | Health check — confirms API is running |
| POST   | `/register` | Register a new user *(pending — not yet in `main`)* |
| POST   | `/login`    | Log in and receive a JWT *(pending — not yet in `main`)* |

> ⚠️ As of this writing, `/register` and `/login` routes and the JWT auth middleware are not yet present in `main`. Update this table once those are pushed.

## Testing Login and Register

Once the auth routes are live, test with curl (or Postman/Insomnia):

```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Confirm registration creates a user in the database, and login returns a valid JWT token.

For now, you can confirm the server is up with:

```bash
curl http://localhost:5000/
```

## Project Structure

```
server/
├── config/
│   ├── db.js       # MySQL connection setup
│   └── seed.js     # Creates + seeds counselors and resources tables
├── index.js        # Express app entry point
├── package.json
└── .env            # Local environment variables (should not be committed)
```

## Team

| Name     | Responsibility                          |
|----------|-------------------------------------------|
| Nziza    | Repo setup, branch strategy, JWT auth     |
| Paradis  | MySQL setup, User table, auth endpoints   |
| Lorris   | Express backend, DB connection, middleware|
| Aurore   | Figma wireframes                          |
| Bruce    | README, endpoint testing                  |
| Huguette | Sprint coordination, Trello, reviews      |


# LeetRevise 🧠⚡

**LeetRevise** is a multi-user, full-stack LeetCode revision tracker built with the MERN stack (MongoDB, Express, React, Node.js) and Supabase Authentication. It leverages spaced repetition to prompt you when to revisit problems you've solved, ensuring algorithm patterns stay fresh in your memory.

---

## 🚀 Features

- **Multi-User Data Isolation**: Powered by Supabase Authentication. Every user's dashboard, problems, and revision history are strictly isolated and encrypted.
- **Spaced Repetition Engine**: Automated interval scheduling (`day3` → `day7` → `day10` → `day21` → `random-cycle 15-45d`).
- **Due Today Dashboard**: Prominent cards highlighting problems requiring action today with celebratory confetti upon revision completion.
- **LeetCode Hint Notes**: Toggleable **Show Hint / Notes** feature displaying user-submitted approaches and notes on demand.
- **Dynamic Revision Status**: Real-time status calculation (`due`, `overdue`, `pending`, `in-random-cycle`).
- **Revision History Timeline**: Modal view tracking every completed or skipped revision checkpoint for each problem.
- **Revision Heatmap & Streak**: GitHub-style contribution grid displaying daily consistency over 16 weeks along with active streak tracking.
- **LeetCode Aesthetic UI**: Dark/Light mode toggle with `localStorage` persistence, orange accents (`#FFA116`), monospace badges for problem numbers, and responsive layouts.

---

## 🔐 Supabase Authentication Setup

LeetRevise uses **Supabase Auth** for Email/Password registration and login.

### 1. Environment Variables

#### Backend (`backend/.env`)
```env
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/leetrevise
USE_MEMORY_DB=false

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

#### Frontend (`frontend/.env`)
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 🛠️ Data Migration Script

If you have existing problems created prior to auth integration, run the migration script to backfill them to your Supabase User UUID:

```bash
cd backend
node scripts/backfillUserId.js <YOUR_SUPABASE_USER_UUID>
```

---

## ⚡ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)
- *(Optional)* Local MongoDB instance. (Falls back to `mongodb-memory-server` if local MongoDB is not running).

---

### 2. Running the Backend

```bash
cd backend
npm install
npm run dev
```

The backend server starts on `http://localhost:5050`.

---

### 3. Running the Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The frontend application starts on `http://localhost:3030`.

---

## 📡 REST API Reference (All Routes Require Auth)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/problems` | Log a new problem attempt (`questionNumber`, `questionTitle`, `notes`) |
| `GET` | `/api/problems` | Get user's problems (Supports filtering by `status` and `search`) |
| `GET` | `/api/problems/due` | Get user's problems due today or overdue |
| `GET` | `/api/problems/stats` | Get user's stats, streak counter, and heatmap data |
| `PATCH` | `/api/problems/:id/revise` | Mark user's revision completed or skipped |
| `PATCH` | `/api/problems/:id` | Edit user's problem notes or title |
| `DELETE` | `/api/problems/:id` | Remove a problem from user's tracking |

*All requests must include `Authorization: Bearer <SUPABASE_JWT_TOKEN>` header.*

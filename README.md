# LeetRevise 🧠⚡

**LeetRevise** is a personal, full-stack LeetCode revision tracker built with the MERN stack (MongoDB, Express, React, Node.js). It leverages spaced repetition to prompt you when to revisit problems you've previously solved, ensuring key algorithm patterns stay fresh in your long-term memory.

---

## 🚀 Features

- **Spaced Repetition Engine**: Automated interval scheduling (`day3` → `day7` → `day10` → `day21` → `random-cycle 15-45d`).
- **Due Today Dashboard**: Prominent cards highlighting problems requiring action today with celebratory confetti upon revision completion.
- **Dynamic Revision Status**: Real-time status calculation (`due`, `overdue`, `pending`, `in-random-cycle`).
- **Revision History Timeline**: Modal view tracking every completed or skipped revision checkpoint for each problem.
- **Revision Heatmap & Streak**: GitHub-style contribution grid displaying daily consistency over 16 weeks along with active streak tracking.
- **LeetCode Aesthetic UI**: Dark/Light mode toggle with `localStorage` persistence, orange accents (`#FFA116`), monospace badges for problem numbers, and responsive layouts.
- **Zero-Config Database Setup**: Automatically uses `mongodb-memory-server` fallback if a local MongoDB server is not running!

---

## 🛠️ Stack & Structure

- **Frontend**: React (Vite, JavaScript), Tailwind CSS, Lucide React, Canvas Confetti, Axios.
- **Backend**: Node.js, Express, MongoDB & Mongoose.

```
leetrevise/
├── backend/                # Express API Server
│   ├── config/             # DB connection & repetition constants
│   ├── controllers/        # REST route handlers
│   ├── models/             # Mongoose Problem & Revision history schemas
│   ├── routes/             # API routes definition
│   ├── utils/              # Date calculations & status mapping
│   ├── server.js           # Server entry point
│   ├── .env.example        # Environment variables template
│   └── package.json
├── frontend/               # React (Vite) UI
│   ├── src/
│   │   ├── components/     # UI Components (Header, DueSection, Heatmap, etc.)
│   │   ├── context/        # Dark/Light ThemeContext
│   │   ├── services/       # Axios API client
│   │   ├── utils/          # Date formatters & stage styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## ⚡ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)
- *(Optional)* Local MongoDB instance. If MongoDB is not running locally, the backend will automatically spin up an in-memory database!

---

### 2. Running the Backend

```bash
cd backend
npm install
npm run dev
```

The backend server starts on `http://localhost:5050`.

#### Environment Variables (`backend/.env`)
```env
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/leetrevise
USE_MEMORY_DB=false
```

---

### 3. Running the Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The frontend application starts on `http://localhost:3030` (with automatic proxy to the backend API).

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/problems` | Log a new problem attempt (`questionNumber`, `questionTitle`, `notes`) |
| `GET` | `/api/problems` | Get all problems (Supports filtering by `status` and `search`) |
| `GET` | `/api/problems/due` | Get problems due today or overdue |
| `GET` | `/api/problems/stats` | Get dashboard stats, streak counter, and heatmap data |
| `PATCH` | `/api/problems/:id/revise` | Mark revision completed or skipped (triggers stage advancement) |
| `PATCH` | `/api/problems/:id` | Edit problem notes or title |
| `DELETE` | `/api/problems/:id` | Remove a problem from tracking |

---

## 🔄 Spaced Repetition Logic

1. **Initial Log**: `firstAttemptDate = now`, `stage = "day3"`, `nextRevisionDate = firstAttemptDate + 3 days`.
2. **Revising a Problem**:
   - Marking complete logs the checkpoint in `revisionHistory` and advances stage:
     - `day3` → `day7` (+7 days)
     - `day7` → `day10` (+10 days)
     - `day10` → `day21` (+21 days)
     - `day21` → `random-cycle` (+ random 15..45 days)
     - `random-cycle` → `random-cycle` (+ random 15..45 days)
3. **Skipping**: Problem remains `due`/`overdue` until acted upon—no silent stage advancement without user confirmation.

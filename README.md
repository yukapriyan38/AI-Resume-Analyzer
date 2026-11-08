# AI Resume Analyzer & Smart Job Matcher

A full-stack MERN application that analyzes resumes with AI, generates an ATS
compatibility score, and matches candidates to relevant job listings.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router DOM, Axios, React Hook Form, TanStack Query
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **Resume Parsing:** pdf-parse, mammoth
- **AI:** OpenAI API
- **File Storage:** Cloudinary
- **Job Data:** Adzuna API, JSearch (RapidAPI)

## Project Structure

```
ai-resume-analyzer/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── hooks/
│       ├── services/
│       ├── context/
│       └── utils/
└── server/          # Express backend
    ├── controllers/
    ├── routes/
    ├── middleware/
    ├── models/
    ├── services/
    ├── utils/
    └── config/
```

## Setup

### 1. Backend

```bash
cd server
cp .env.example .env   # fill in Mongo URI, JWT secret, OpenAI key, Cloudinary keys, job API keys
npm install
npm run dev             # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd client
cp .env.example .env    # set VITE_API_URL if not using the default
npm install
npm run dev              # starts on http://localhost:5173
```

## Required API Keys

| Service    | Purpose                          | Get a key at                                    |
|------------|-----------------------------------|--------------------------------------------------|
| MongoDB    | Database                          | Local install or MongoDB Atlas                   |
| OpenAI     | Resume analysis, ATS scoring, job matching | https://platform.openai.com                |
| Cloudinary | Resume file storage               | https://cloudinary.com                            |
| Adzuna     | Job search (optional)             | https://developer.adzuna.com                      |
| JSearch    | Job search via RapidAPI (optional)| https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch |

The app runs without Adzuna/JSearch keys, but job search results will be empty
until at least one is configured. OpenAI is required for resume analysis, ATS
scoring, and job matching to work.

## REST API Overview

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/user/profile
PUT    /api/user/profile

POST   /api/resume/upload
GET    /api/resume/:id
GET    /api/resume/history
DELETE /api/resume/:id

GET    /api/ats/:resumeId

GET    /api/jobs/search
GET    /api/jobs/match/:jobId
POST   /api/jobs/save
DELETE /api/jobs/save/:id
GET    /api/jobs/saved
```

## Notes

- No deployment, Docker, CI/CD, or microservices setup is included by design — this
  is a single Express backend + single React frontend, run locally.
- Multer stores uploads temporarily in `server/uploads/` before pushing to
  Cloudinary and deleting the local copy.
- Production startup validates `MONGO_URI` and a strong `JWT_SECRET`, waits for
  MongoDB before listening, exposes `/api/health/live` and readiness-aware
  `/api/health`, and handles graceful shutdown.
- Authentication uses an HttpOnly cookie; JWTs are not returned to the frontend.
  Uploads are limited to 5 MB and validated by PDF/DOCX magic
  bytes before parsing; resume records are user-scoped.
- Set `CLIENT_URL` to a comma-separated allowlist of trusted origins. External
  API calls use `EXTERNAL_API_TIMEOUT_MS`; Helmet, body limits, and rate limits
  protect requests.
- `GET /api/liveness` checks only that the process is alive. `GET /api/health`
  returns 200 only when MongoDB is connected.
- AI calls use `gpt-4o-mini` by default — change the `MODEL` constant in
  `server/services/aiService.js` if you'd prefer a different model.

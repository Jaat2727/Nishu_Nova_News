# ⚡ NovaNews — AI-Powered News Feed

NovaNews is a full-stack news aggregation app that delivers headlines from around the world and summarizes them with AI (Gemma 3 27B via Google AI). Users can search, filter by category, bookmark articles, and get instant AI summaries — all wrapped in a stunning dark-mode UI with animated characters on the login page.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?logo=supabase&logoColor=white)

---

## 📋 Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Step 1 — Supabase Setup](#step-1--supabase-setup)
6. [Step 2 — Get API Keys](#step-2--get-api-keys)
7. [Step 3 — Environment Variables](#step-3--environment-variables)
8. [Step 4 — Install Dependencies](#step-4--install-dependencies)
9. [Step 5 — Run Locally](#step-5--run-locally)
10. [Database Schema (Full SQL)](#database-schema-full-sql)
11. [Troubleshooting](#troubleshooting)

---

## ✨ Features

- **Live News Headlines** — Fetches real-time news from [NewsAPI](https://newsapi.org) across 7 categories
- **AI Summarization** — One-click article summaries powered by Google's Gemma 3 27B model
- **Bookmarks / Library** — Save articles to your personal library (stored in Supabase)
- **Auth** — Email/Password sign-up & sign-in + Google OAuth via Supabase Auth
- **Animated Login Page** — Interactive characters with eye-tracking that react to your input
- **Fully Responsive** — Works on desktop, tablet, and mobile
- **Dark Mode UI** — Premium glassmorphism design with purple accent theme

---

## 🛠 Tech Stack

| Layer      | Technology                                                                 |
|------------|----------------------------------------------------------------------------|
| Frontend   | React 19, Vite 8, React Router v7, Axios                                  |
| Backend    | Node.js, Express 5                                                         |
| Database   | Supabase (PostgreSQL) with Row Level Security (RLS)                        |
| Auth       | Supabase Auth (email/password + Google OAuth)                              |
| AI         | Google Generative AI SDK → Gemma 3 27B (`gemma-3-27b-it`)                 |
| News API   | [NewsAPI.org](https://newsapi.org) (free tier: 100 requests/day)           |
| Styling    | Vanilla CSS (custom design system with CSS variables)                      |

---

## 📁 Project Structure

```
Software Guild/
├── backend/
│   ├── .env                  # Backend environment variables (NOT committed)
│   ├── index.js              # Express server entry point
│   ├── package.json          # Backend dependencies
│   ├── supabaseClient.js     # Supabase client (backend)
│   └── routes/
│       ├── ai.js             # POST /api/ai/summarize — Gemma 3 27B summarization
│       ├── news.js           # GET  /api/news/headlines — NewsAPI proxy
│       └── saved.js          # CRUD /api/saved — Bookmark management
│
├── frontend/
│   ├── .env                  # Frontend environment variables (NOT committed)
│   ├── index.html            # HTML entry point
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.js        # Vite configuration
│   └── src/
│       ├── main.jsx          # React entry point
│       ├── App.jsx           # Root component (routing + auth state)
│       ├── App.css           # Global styles + design tokens
│       ├── index.css         # Base reset
│       ├── supabaseClient.js # Supabase client (frontend)
│       ├── components/
│       │   ├── Navbar.jsx    # Top navigation bar
│       │   ├── Navbar.css
│       │   ├── NewsCard.jsx  # Individual article card
│       │   └── NewsCard.css
│       └── pages/
│           ├── Login.jsx     # Auth page (sign-in / sign-up)
│           ├── Login.css
│           ├── Home.jsx      # Main news feed
│           ├── Home.css
│           ├── Library.jsx   # Saved articles / bookmarks
│           ├── Library.css
│           ├── Contact.jsx   # Contact / social links page
│           └── Contact.css
│
├── .gitignore
└── README.md                 # ← You are here
```

---

## ⚙️ Prerequisites

Before you start, make sure you have:

| Requirement       | Version  | How to get it                                      |
|-------------------|----------|----------------------------------------------------|
| **Node.js**       | ≥ 18.x   | [nodejs.org](https://nodejs.org)                   |
| **npm**           | ≥ 9.x    | Comes with Node.js                                 |
| **Supabase Account** | Free tier | [supabase.com](https://supabase.com)           |
| **NewsAPI Key**   | Free     | [newsapi.org/register](https://newsapi.org/register)|
| **Google AI API Key** | Free | [aistudio.google.com](https://aistudio.google.com/app/apikey) |

---

## 🗄 Step 1 — Supabase Setup

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Choose an organization (or create one)
4. Fill in:
   - **Name:** `Nova_News` (or any name you like)
   - **Database Password:** choose a strong password (save it somewhere)
   - **Region:** pick one close to you
5. Click **"Create new project"** and wait ~2 minutes for it to spin up

### 1.2 Run the Database SQL

Go to the **SQL Editor** in your Supabase dashboard (left sidebar → SQL Editor) and run the complete SQL from the [Database Schema section](#database-schema-full-sql) below.

### 1.3 Enable Email Auth (already enabled by default)

1. Go to **Authentication → Providers** in your Supabase dashboard
2. **Email** should already be enabled
3. ⚠️ **Important:** If you want sign-up to work instantly without email verification:
   - Go to **Authentication → Settings → Email Auth**
   - **Disable** "Confirm email" toggle
   - This lets users sign in immediately after sign-up (recommended for development)

### 1.4 (Optional) Enable Google OAuth

1. Go to **Authentication → Providers → Google**
2. Toggle it **ON**
3. You'll need a Google OAuth Client ID and Secret:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new **OAuth 2.0 Client ID** (Web application)
   - Add authorized redirect URI: `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client Secret** into Supabase
4. Click **Save**

### 1.5 Get Your Supabase Keys

1. Go to **Settings → API** in your Supabase dashboard
2. Copy these two values:
   - **Project URL** — looks like `https://xxxxxxxx.supabase.co`
   - **anon (public) key** — starts with `eyJhbGciOiJIUzI1NiI...`

---

## 🔑 Step 2 — Get API Keys

### NewsAPI Key
1. Go to [newsapi.org/register](https://newsapi.org/register)
2. Create a free account
3. Copy your API key from the dashboard

### Google AI (Gemini) API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy the generated key (starts with `AIzaSy...`)

---

## 📝 Step 3 — Environment Variables

You need to create **two** `.env` files — one for the backend and one for the frontend.

### Backend `.env`

Create the file `backend/.env`:

```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEWS_API_KEY=your_newsapi_key_here
GEMINI_API_KEY=your_google_ai_api_key_here
PORT=5000
```

### Frontend `.env`

Create the file `frontend/.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_BACKEND_URL=http://localhost:5000
```

> ⚠️ **Note:** Frontend env vars in Vite MUST start with `VITE_` to be accessible in the browser. Never put secret keys (like `GEMINI_API_KEY` or `NEWS_API_KEY`) in the frontend `.env` — they go in the backend only.

---

## 📦 Step 4 — Install Dependencies

Open **two terminals** and run:

### Terminal 1 — Backend

```bash
cd backend
npm install
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
```

---

## 🚀 Step 5 — Run Locally

### Terminal 1 — Start the Backend

```bash
cd backend
npm start
# or for auto-restart on file changes:
npm run dev
```

You should see:
```
🚀 Server running on port 5000
```

### Terminal 2 — Start the Frontend

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser. You should see the login page with animated characters! 🎉

---

## 🗃 Database Schema (Full SQL)

Copy and paste this entire block into your Supabase **SQL Editor** and click **Run**:

```sql
-- ╔══════════════════════════════════════════════════════════════╗
-- ║             NovaNews — Complete Database Setup               ║
-- ║  Run this in Supabase SQL Editor to set up everything.       ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 1. Create the saved_articles table
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CREATE TABLE IF NOT EXISTS public.saved_articles (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT,
  description TEXT,
  url         TEXT,
  urltoimage  TEXT,       -- stored as lowercase (matches NewsAPI field)
  summary     TEXT,       -- AI-generated summary (nullable, filled on demand)
  created_at  TIMESTAMP   DEFAULT now()
);

-- Add a comment for documentation
COMMENT ON TABLE public.saved_articles IS 'User-bookmarked news articles with optional AI summaries';
COMMENT ON COLUMN public.saved_articles.urltoimage IS 'Thumbnail image URL from NewsAPI (stored lowercase)';
COMMENT ON COLUMN public.saved_articles.summary IS 'AI-generated summary via Gemma 3 27B (nullable)';

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 2. Enable Row Level Security (RLS)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALTER TABLE public.saved_articles ENABLE ROW LEVEL SECURITY;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 3. Create RLS Policies
--    Users can only read, insert, and delete THEIR OWN articles.
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- SELECT: Users can only see their own saved articles
CREATE POLICY "authenticated_select_own"
  ON public.saved_articles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- INSERT: Users can only insert articles with their own user_id
CREATE POLICY "authenticated_insert_own"
  ON public.saved_articles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own saved articles
CREATE POLICY "authenticated_delete_own"
  ON public.saved_articles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 4. Create index for fast lookups by user
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CREATE INDEX IF NOT EXISTS idx_saved_articles_user_id
  ON public.saved_articles(user_id);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Done! Your database is ready. ✅
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### What this creates:

| Object | Type | Purpose |
|--------|------|---------|
| `saved_articles` | Table | Stores bookmarked articles per user |
| `authenticated_select_own` | RLS Policy | Users can only SELECT their own rows |
| `authenticated_insert_own` | RLS Policy | Users can only INSERT with their own user_id |
| `authenticated_delete_own` | RLS Policy | Users can only DELETE their own rows |
| `idx_saved_articles_user_id` | Index | Fast lookups when filtering by user_id |

---

## 🔧 Troubleshooting

### "Couldn't load news" / News not showing
- Check that your `NEWS_API_KEY` is valid in `backend/.env`
- NewsAPI free tier only allows **100 requests/day** and only works from `localhost` (not deployed domains)
- Make sure the backend is running on port 5000

### Sign-up doesn't work / "Email not confirmed"
- Go to Supabase → **Authentication → Settings → Email Auth**
- **Disable** "Confirm email" for development
- Or check your email for the confirmation link

### AI Summary fails / "Failed to generate summary"
- Check that `GEMINI_API_KEY` is set in `backend/.env`
- Make sure the key has access to the Gemma models
- Try generating a key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Google Sign-In not working
- Make sure you've enabled the Google provider in Supabase Auth settings
- Verify the OAuth redirect URI matches your Supabase project URL
- See [Step 1.4](#14-optional-enable-google-oauth) above

### Bookmark save fails with "RLS policy violation"
- Make sure you ran the full SQL schema above
- The user must be authenticated (signed in) to save articles
- Check that the `saved_articles` table has RLS enabled with the correct policies

### CORS errors
- The backend uses `cors()` middleware which allows all origins by default
- If deploying, configure CORS to only allow your frontend domain

### "Cannot find module" errors
- Run `npm install` in both `backend/` and `frontend/` directories
- Make sure you're using Node.js ≥ 18

---

## 📄 License

MIT

---

Made with ❤️ by Nishu

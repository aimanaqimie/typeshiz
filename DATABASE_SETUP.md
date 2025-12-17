# Database Setup Instructions

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in project details and create

## 2. Create Scores Table

Run this SQL in the Supabase SQL Editor:

```sql
-- Create scores table
CREATE TABLE scores (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  wpm INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_scores_username ON scores(username);
CREATE INDEX idx_scores_wpm ON scores(wpm DESC);
CREATE INDEX idx_scores_created_at ON scores(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to insert and read scores
CREATE POLICY "Allow public insert" ON scores
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "Allow public read" ON scores
  FOR SELECT
  TO PUBLIC
  USING (true);
```

## 3. Get Your Supabase Credentials

1. Go to Project Settings > API
2. Copy the "Project URL" and "anon public" key
3. Update `.env.local` file with these values:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Restart Development Server

After updating `.env.local`, restart your development server:

```bash
npm run dev
```

## Table Structure

| Column      | Type      | Description                    |
|-------------|-----------|--------------------------------|
| id          | BIGSERIAL | Primary key                    |
| username    | TEXT      | Player username (3-10 chars)   |
| wpm         | INTEGER   | Words per minute score         |
| accuracy    | INTEGER   | Accuracy percentage            |
| created_at  | TIMESTAMP | When the score was recorded    |

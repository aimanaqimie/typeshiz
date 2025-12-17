-- Create scores table
CREATE TABLE scores (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  wpm INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
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

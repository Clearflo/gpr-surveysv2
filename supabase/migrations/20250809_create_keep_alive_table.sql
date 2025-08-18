-- Create keep_alive table to prevent Supabase project from pausing
-- This table will be pinged by GitHub Actions every 5 days to maintain activity

CREATE TABLE IF NOT EXISTS keep_alive (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pinged_at timestamptz DEFAULT now(),
  source text DEFAULT 'github-action'
);

-- Enable RLS
ALTER TABLE keep_alive ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public to insert (for GitHub Action)
CREATE POLICY "Allow public to insert keep_alive"
  ON keep_alive FOR INSERT TO public
  WITH CHECK (true);

-- Create policy to allow public to read keep_alive
CREATE POLICY "Allow public to read keep_alive"
  ON keep_alive FOR SELECT TO public
  USING (true);

-- Create index on pinged_at for performance
CREATE INDEX idx_keep_alive_pinged_at ON keep_alive(pinged_at);

-- Add comment for documentation
COMMENT ON TABLE keep_alive IS 'Table used to keep Supabase project active by periodic pings from GitHub Actions';

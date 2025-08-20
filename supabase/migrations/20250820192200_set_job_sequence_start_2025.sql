-- Set job number sequence so the next generated job number will be J25140 for 2025
-- Safeguarded to not override if the sequence is already at or beyond 140

DO $$
DECLARE
  y INTEGER := 25; -- two-digit year for 2025
BEGIN
  -- Ensure the job_numbers table exists (migration dependency safety)
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_name = 'job_numbers'
  ) THEN
    RAISE NOTICE 'job_numbers table does not exist; skipping seed';
    RETURN;
  END IF;

  -- Insert a seed row at 139 so get_next_job_number() returns 140 next
  -- Only do this if there is no existing number >= 139 for 2025
  IF NOT EXISTS (
    SELECT 1 FROM job_numbers WHERE year = y AND number >= 139
  ) THEN
    INSERT INTO job_numbers (number, year) VALUES (139, y);
    RAISE NOTICE 'Seeded job_numbers for 2025 to 139 (next will be 140)';
  ELSE
    RAISE NOTICE 'job_numbers for 2025 already at or above 139; no changes';
  END IF;
END $$;

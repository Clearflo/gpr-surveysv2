-- Add site_files JSONB array to bookings to persist uploaded project file URLs
-- Safe to run multiple times
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'bookings'
      AND column_name  = 'site_files'
  ) THEN
    ALTER TABLE public.bookings
      ADD COLUMN site_files jsonb NOT NULL DEFAULT '[]'::jsonb;
  END IF;
END $$;

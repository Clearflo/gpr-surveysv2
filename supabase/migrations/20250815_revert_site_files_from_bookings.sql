-- Revert: remove site_files from bookings if it exists to preserve current behavior (files via webhook only)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'bookings'
      AND column_name  = 'site_files'
  ) THEN
    ALTER TABLE public.bookings
      DROP COLUMN site_files;
  END IF;
END $$;

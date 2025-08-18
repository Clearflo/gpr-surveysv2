/*
  # Add blocked bookings support
  
  1. Changes
    - Add admin_code column to bookings table
    - Add is_blocked flag to bookings table
    - Add check constraint for admin code validation
    - Update booking availability check to handle blocked slots

  2. Security
    - Maintains existing RLS policies
    - Adds validation for admin-only blocked bookings
*/

-- Add columns for blocked bookings
ALTER TABLE bookings 
ADD COLUMN is_blocked boolean DEFAULT false,
ADD COLUMN admin_code text;

-- Add check constraint to validate admin code for blocked bookings
ALTER TABLE bookings
ADD CONSTRAINT blocked_booking_requires_code
CHECK (
  (is_blocked = false) OR 
  (is_blocked = true AND admin_code = 'GPR2024BLOCK')
);

-- Update the booking availability check function
CREATE OR REPLACE FUNCTION check_booking_availability()
RETURNS TRIGGER AS $$
BEGIN
  -- First check if the date is blocked
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
    AND is_blocked = true
  ) THEN
    RAISE EXCEPTION 'Date % is blocked and unavailable for booking', NEW.date;
  END IF;

  -- Then proceed with regular availability checks
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
    AND duration = 'over-4'
  ) THEN
    RAISE EXCEPTION 'Date % is already fully booked', NEW.date;
  END IF;

  IF NEW.duration = 'over-4' AND EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
  ) THEN
    RAISE EXCEPTION 'Cannot book full day when other bookings exist on %', NEW.date;
  END IF;

  IF NEW.duration = 'under-4' AND (
    SELECT COUNT(*) FROM bookings 
    WHERE date = NEW.date 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
  ) >= 2 THEN
    RAISE EXCEPTION 'Maximum two half-day bookings allowed on %', NEW.date;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
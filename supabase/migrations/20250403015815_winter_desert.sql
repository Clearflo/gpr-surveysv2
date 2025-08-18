/*
  # Update booking availability function to prevent same-day bookings
  
  1. Changes
    - Modify check_booking_availability function to prevent bookings on the same day
    - Ensure bookings can only be made for tomorrow or later
    
  2. Security
    - Maintains existing RLS policies
    - Adds additional validation for booking dates
*/

-- Drop the existing trigger to replace it with updated function
DROP TRIGGER IF EXISTS check_booking_availability_trigger ON bookings;

-- Create an updated booking availability check function
CREATE OR REPLACE FUNCTION check_booking_availability()
RETURNS TRIGGER AS $$
DECLARE
  today date := CURRENT_DATE;
  tomorrow date := CURRENT_DATE + 1;
BEGIN
  -- Skip availability check for cancelled or updated cancelled bookings
  IF NEW.status = 'cancelled' OR NEW.cancelled_at IS NOT NULL THEN
    RETURN NEW;
  END IF;
  
  -- Skip availability check for reschedule operations
  IF TG_OP = 'UPDATE' AND NEW.status = 'rescheduled' THEN
    RETURN NEW;
  END IF;

  -- Skip checks for admin-blocked bookings
  IF NEW.is_blocked = true AND NEW.admin_code = 'GPR2025BLOCK' THEN
    RETURN NEW;
  END IF;

  -- Check if booking date is at least tomorrow (no same-day bookings)
  IF NEW.date <= today THEN
    RAISE EXCEPTION 'Bookings must be made at least one day in advance (tomorrow or later)';
  END IF;

  -- Check if the date is blocked
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
    AND is_blocked = true
    AND status != 'cancelled'
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
  ) THEN
    RAISE EXCEPTION 'Date % is blocked and unavailable for booking', NEW.date;
  END IF;

  -- Check existing active bookings (not cancelled)
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
    AND duration = 'over-4'
    AND status != 'cancelled'
    AND cancelled_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Date % is already fully booked', NEW.date;
  END IF;

  -- Check for long booking conflicts
  IF NEW.duration = 'over-4' AND EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
    AND status != 'cancelled'
    AND cancelled_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Cannot book full day when other bookings exist on %', NEW.date;
  END IF;

  -- Check for maximum short bookings
  IF NEW.duration = 'under-4' AND (
    SELECT COUNT(*) FROM bookings 
    WHERE date = NEW.date 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
    AND status != 'cancelled'
    AND cancelled_at IS NULL
  ) >= 2 THEN
    RAISE EXCEPTION 'Maximum two half-day bookings allowed on %', NEW.date;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Re-create trigger with updated function
CREATE TRIGGER check_booking_availability_trigger
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_booking_availability();
/*
  # Add time selection to bookings
  
  1. Changes
    - Add start_time column to bookings table
    - Update booking availability check to allow only one booking per day
    - Remove duration-based booking logic
    
  2. Security
    - Maintains existing RLS policies
    - Updates validation for simpler one-booking-per-day rule
*/

-- Add start_time column to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS start_time TIME;

-- Drop the existing trigger to replace it with updated function
DROP TRIGGER IF EXISTS check_booking_availability_trigger ON bookings;

-- Create simplified booking availability check function (one booking per day)
CREATE OR REPLACE FUNCTION check_booking_availability()
RETURNS TRIGGER AS $$
DECLARE
  today date := CURRENT_DATE;
  tomorrow date := CURRENT_DATE + 1;
BEGIN
  -- Skip availability check for cancelled bookings
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

  -- Check if date already has a booking (only one per day allowed)
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
    AND status != 'cancelled'
    AND cancelled_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Date % already has a booking. Only one booking allowed per day.', NEW.date;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Re-create trigger with updated function
CREATE TRIGGER check_booking_availability_trigger
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_booking_availability();

-- Comment on the new column
COMMENT ON COLUMN bookings.start_time IS 'The scheduled start time for the booking';

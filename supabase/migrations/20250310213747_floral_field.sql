/*
  # Add booking constraints

  1. Changes
    - Add trigger to enforce booking duration rules:
      - Only one booking allowed per day if duration is 'over-4'
      - Maximum two bookings per day if duration is 'under-4'
      - Cannot mix 'over-4' with any other bookings on same day

  2. Security
    - Maintains existing RLS policies
    - Adds server-side validation for booking rules
*/

-- Create function to validate booking constraints
CREATE OR REPLACE FUNCTION check_booking_availability()
RETURNS TRIGGER AS $$
BEGIN
  -- Check existing bookings for the same date
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
    AND duration = 'over-4'
  ) THEN
    RAISE EXCEPTION 'Date % is already fully booked', NEW.date;
  END IF;

  -- If new booking is over 4 hours, check no other bookings exist
  IF NEW.duration = 'over-4' AND EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
  ) THEN
    RAISE EXCEPTION 'Cannot book full day when other bookings exist on %', NEW.date;
  END IF;

  -- If new booking is under 4 hours, check max two bookings per day
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

-- Create trigger for booking constraints
DROP TRIGGER IF EXISTS check_booking_availability_trigger ON bookings;
CREATE TRIGGER check_booking_availability_trigger
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_booking_availability();

-- Add check constraint to validate duration values
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS valid_duration;
ALTER TABLE bookings ADD CONSTRAINT valid_duration
  CHECK (duration IN ('under-4', 'over-4'));
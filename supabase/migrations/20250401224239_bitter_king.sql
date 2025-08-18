/*
  # Fix booking cancellation and status management
  
  1. Changes
    - Fix issue with booking cancellation and rescheduling
    - Update validation triggers to handle status transitions correctly
    - Improve notification system for real-time updates
    - Clarify constraints and validation rules
    
  2. Security
    - Maintains existing RLS policies
*/

-- First drop existing triggers that might interfere with status changes
DROP TRIGGER IF EXISTS validate_booking_status_trigger ON bookings;
DROP TRIGGER IF EXISTS check_booking_availability_trigger ON bookings;
DROP TRIGGER IF EXISTS notify_booking_change_trigger ON bookings;

-- Create an enhanced booking status validation function
CREATE OR REPLACE FUNCTION validate_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If cancellation fields are set, ensure status is 'cancelled'
  IF NEW.cancelled_at IS NOT NULL AND NEW.status != 'cancelled' THEN
    NEW.status := 'cancelled';
  END IF;
  
  -- If rescheduling fields are set, ensure status is 'rescheduled'
  IF NEW.rescheduled_to_date IS NOT NULL AND NEW.status != 'rescheduled' THEN
    NEW.status := 'rescheduled';
  END IF;
  
  -- Block invalid state transitions
  IF OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
    RAISE EXCEPTION 'Cannot change status of cancelled booking';
  END IF;
  
  RAISE NOTICE 'Booking status change: % -> % (ID: %)', 
    OLD.status, NEW.status, NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a more robust booking availability check function
CREATE OR REPLACE FUNCTION check_booking_availability()
RETURNS TRIGGER AS $$
BEGIN
  -- Skip availability check for cancelled or updated cancelled bookings
  IF NEW.status = 'cancelled' OR NEW.cancelled_at IS NOT NULL THEN
    RETURN NEW;
  END IF;
  
  -- Skip availability check for reschedule operations
  IF TG_OP = 'UPDATE' AND NEW.status = 'rescheduled' THEN
    RETURN NEW;
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

-- Create an improved notification trigger
CREATE OR REPLACE FUNCTION notify_booking_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Always send notification for status, cancellation, or date changes
  PERFORM pg_notify(
    'booking_changed',
    json_build_object(
      'id', NEW.id,
      'date', NEW.date, 
      'status', NEW.status,
      'cancelled_at', NEW.cancelled_at,
      'updated_at', now()
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add email validation function if not exists
CREATE OR REPLACE FUNCTION is_valid_email(email text)
RETURNS boolean AS $$
BEGIN
  RETURN email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- Re-create triggers in proper order
CREATE TRIGGER validate_booking_status_trigger
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION validate_booking_status_change();

CREATE TRIGGER check_booking_availability_trigger
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_booking_availability();

CREATE TRIGGER notify_booking_change_trigger
  AFTER UPDATE OF status, date, cancelled_at, rescheduled_to_date ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking_change();

-- Create new indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_date_status ON bookings(date, status);
CREATE INDEX IF NOT EXISTS idx_bookings_cancelled_at ON bookings(cancelled_at);
CREATE INDEX IF NOT EXISTS idx_bookings_rescheduled_at ON bookings(rescheduled_at);

-- Ensure valid_status constraint is up-to-date
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS valid_status;
ALTER TABLE bookings ADD CONSTRAINT valid_status
  CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'));
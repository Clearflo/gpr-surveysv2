/*
  # Fix for booking cancellation and rescheduling

  1. Changes
    - Adds missing indexes for performance
    - Fixes real-time notification trigger
    - Improves status change handling
    - Adds more robust booking availability checks

  2. Security
    - Maintains existing RLS policies
*/

-- Add missing indexes for status queries if not exist
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date_status ON bookings(date, status);

-- Check if the notification trigger exists and drop only if it does
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'notify_booking_change_trigger'
  ) THEN
    DROP TRIGGER notify_booking_change_trigger ON bookings;
  END IF;
END $$;

-- First drop existing triggers that might interfere with our updates
DROP TRIGGER IF EXISTS validate_booking_status_trigger ON bookings;
DROP TRIGGER IF EXISTS check_booking_availability_trigger ON bookings;

-- Drop existing functions that will be redefined with different return types
DROP FUNCTION IF EXISTS cancel_booking(uuid, text, text);
DROP FUNCTION IF EXISTS reschedule_booking(uuid, date, text);

-- Update the validation function to be more robust
CREATE OR REPLACE FUNCTION validate_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Force the status field to match the actual booking state
  IF NEW.cancelled_at IS NOT NULL THEN
    NEW.status := 'cancelled';
  ELSIF NEW.rescheduled_to_date IS NOT NULL AND NEW.rescheduled_from_date IS NOT NULL THEN
    NEW.status := 'rescheduled';
  END IF;

  -- Log status change for debugging
  RAISE NOTICE 'Booking status change: % -> % (ID: %)', 
    OLD.status, NEW.status, NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a new check_booking_availability function that handles cancellations better
CREATE OR REPLACE FUNCTION check_booking_availability()
RETURNS TRIGGER AS $$
BEGIN
  -- Skip availability check for cancelled bookings
  IF NEW.status = 'cancelled' OR NEW.cancelled_at IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Skip availability check for bookings being rescheduled
  IF TG_OP = 'UPDATE' AND NEW.status = 'rescheduled' AND NEW.id = OLD.id AND NEW.date != OLD.date THEN
    -- Just log the rescheduling
    RAISE NOTICE 'Booking rescheduled: % -> % (ID: %)', 
      OLD.date, NEW.date, NEW.id;
    RETURN NEW;
  END IF;

  -- Check if the date is blocked
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
    AND is_blocked = true
    AND status != 'cancelled'
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

-- Create real-time notification trigger to ensure clients get updates
CREATE OR REPLACE FUNCTION notify_booking_change()
RETURNS TRIGGER AS $$
BEGIN
  -- This ensures clients get a notification even when status is changed
  -- but the database prevents sending the update due to optimization
  PERFORM pg_notify(
    'booking_changed',
    json_build_object(
      'id', NEW.id,
      'date', NEW.date, 
      'status', NEW.status,
      'updated_at', now()
    )::text
  );
  
  RETURN NEW;
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

-- Create the notify trigger only if it doesn't already exist
CREATE TRIGGER notify_booking_change_trigger
  AFTER UPDATE OF status, date, cancelled_at, rescheduled_to_date ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking_change();

-- Add function to properly cancel a booking
CREATE FUNCTION cancel_booking(
  booking_id uuid,
  cancelled_by_user text,
  reason text
)
RETURNS boolean AS $$
DECLARE
  success boolean;
BEGIN
  UPDATE bookings
  SET 
    status = 'cancelled',
    cancelled_at = now(),
    cancelled_by = cancelled_by_user,
    cancellation_reason = reason
  WHERE id = booking_id
  AND status != 'cancelled';
  
  GET DIAGNOSTICS success = ROW_COUNT;
  RETURN success > 0;
END;
$$ LANGUAGE plpgsql;

-- Add function to properly reschedule a booking
CREATE FUNCTION reschedule_booking(
  booking_id uuid,
  new_date date,
  rescheduled_by_user text
)
RETURNS boolean AS $$
DECLARE
  current_date date;
  success boolean;
BEGIN
  -- Get current date first
  SELECT date INTO current_date FROM bookings WHERE id = booking_id;
  
  -- Then update with all fields at once
  UPDATE bookings
  SET 
    date = new_date,
    status = 'rescheduled',
    rescheduled_from_date = current_date,
    rescheduled_to_date = new_date,
    rescheduled_at = now(),
    rescheduled_by = rescheduled_by_user
  WHERE id = booking_id
  AND status != 'cancelled';
  
  GET DIAGNOSTICS success = ROW_COUNT;
  RETURN success > 0;
END;
$$ LANGUAGE plpgsql;
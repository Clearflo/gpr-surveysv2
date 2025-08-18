/*
  # Add booking status management
  
  1. Changes
    - Add status tracking columns
    - Add audit columns for cancellations and rescheduling
    - Add trigger functions for status management
    - Add indices for performance
    
  2. Security
    - Maintains existing RLS policies
    - Adds validation for status changes
*/

-- Add new status tracking columns
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS cancelled_at timestamptz,
ADD COLUMN IF NOT EXISTS cancelled_by text,
ADD COLUMN IF NOT EXISTS cancellation_reason text,
ADD COLUMN IF NOT EXISTS rescheduled_from_date date,
ADD COLUMN IF NOT EXISTS rescheduled_to_date date,
ADD COLUMN IF NOT EXISTS rescheduled_at timestamptz,
ADD COLUMN IF NOT EXISTS rescheduled_by text;

-- Create index for status queries
CREATE INDEX IF NOT EXISTS idx_bookings_cancelled_at ON bookings(cancelled_at);
CREATE INDEX IF NOT EXISTS idx_bookings_rescheduled_at ON bookings(rescheduled_at);

-- Create function to validate status changes
CREATE OR REPLACE FUNCTION validate_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if booking is already cancelled
  IF OLD.cancelled_at IS NOT NULL AND NEW.cancelled_at IS NOT NULL THEN
    RAISE EXCEPTION 'Booking is already cancelled';
  END IF;

  -- Check if booking is already rescheduled
  IF OLD.rescheduled_to_date IS NOT NULL AND NEW.rescheduled_to_date IS NOT NULL THEN
    RAISE EXCEPTION 'Booking is already rescheduled';
  END IF;

  -- When cancelling, ensure all required fields are set
  IF NEW.cancelled_at IS NOT NULL AND (
    NEW.cancelled_by IS NULL OR 
    NEW.cancellation_reason IS NULL
  ) THEN
    RAISE EXCEPTION 'Cancellation requires cancelled_by and reason';
  END IF;

  -- When rescheduling, ensure all required fields are set
  IF NEW.rescheduled_to_date IS NOT NULL AND (
    NEW.rescheduled_from_date IS NULL OR
    NEW.rescheduled_at IS NULL OR
    NEW.rescheduled_by IS NULL
  ) THEN
    RAISE EXCEPTION 'Rescheduling requires from_date, at, and by fields';
  END IF;

  -- Update status based on changes
  IF NEW.cancelled_at IS NOT NULL THEN
    NEW.status := 'cancelled';
  ELSIF NEW.rescheduled_to_date IS NOT NULL THEN
    NEW.status := 'rescheduled';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status validation
DROP TRIGGER IF EXISTS validate_booking_status_trigger ON bookings;
CREATE TRIGGER validate_booking_status_trigger
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION validate_booking_status_change();

-- Create function to handle booking cancellation
CREATE OR REPLACE FUNCTION cancel_booking(
  booking_id uuid,
  cancelled_by_user text,
  reason text
)
RETURNS void AS $$
BEGIN
  UPDATE bookings
  SET cancelled_at = now(),
      cancelled_by = cancelled_by_user,
      cancellation_reason = reason,
      status = 'cancelled'
  WHERE id = booking_id
  AND cancelled_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found or already cancelled';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle booking rescheduling
CREATE OR REPLACE FUNCTION reschedule_booking(
  booking_id uuid,
  new_date date,
  rescheduled_by_user text
)
RETURNS void AS $$
BEGIN
  -- First check if the new date is available
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = new_date 
    AND id != booking_id
    AND cancelled_at IS NULL
    AND status != 'cancelled'
  ) THEN
    RAISE EXCEPTION 'Selected date is not available';
  END IF;

  UPDATE bookings
  SET rescheduled_from_date = date,
      rescheduled_to_date = new_date,
      rescheduled_at = now(),
      rescheduled_by = rescheduled_by_user,
      date = new_date,
      status = 'rescheduled'
  WHERE id = booking_id
  AND cancelled_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found or already cancelled';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Update status enum to include new states
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS valid_status;
ALTER TABLE bookings ADD CONSTRAINT valid_status
  CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'));

-- Add function to check booking availability considering cancellations
CREATE OR REPLACE FUNCTION check_booking_availability()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the date is blocked
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
    AND is_blocked = true
  ) THEN
    RAISE EXCEPTION 'Date % is blocked and unavailable for booking', NEW.date;
  END IF;

  -- Check existing active bookings (not cancelled)
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
    AND duration = 'over-4'
    AND cancelled_at IS NULL
    AND status != 'cancelled'
  ) THEN
    RAISE EXCEPTION 'Date % is already fully booked', NEW.date;
  END IF;

  -- Check for long booking conflicts
  IF NEW.duration = 'over-4' AND EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
    AND cancelled_at IS NULL
    AND status != 'cancelled'
  ) THEN
    RAISE EXCEPTION 'Cannot book full day when other bookings exist on %', NEW.date;
  END IF;

  -- Check for maximum short bookings
  IF NEW.duration = 'under-4' AND (
    SELECT COUNT(*) FROM bookings 
    WHERE date = NEW.date 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
    AND cancelled_at IS NULL
    AND status != 'cancelled'
  ) >= 2 THEN
    RAISE EXCEPTION 'Maximum two half-day bookings allowed on %', NEW.date;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
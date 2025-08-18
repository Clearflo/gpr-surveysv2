/*
  # Fix booking status transitions
  
  1. Changes
    - Update validate_booking_status_change function to allow cancellation of rescheduled bookings
    - Improve booking status handling to correctly process status transitions
    - Add clearer validation for booking status changes
    
  2. Security
    - Maintains existing RLS policies
    - No changes to access control
*/

-- Drop the existing validate_booking_status_trigger to replace it
DROP TRIGGER IF EXISTS validate_booking_status_trigger ON bookings;

-- Create an improved booking status validation function
CREATE OR REPLACE FUNCTION validate_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow cancellation of any booking regardless of its current status
  IF NEW.cancelled_at IS NOT NULL THEN
    NEW.status := 'cancelled';
    RETURN NEW;
  END IF;
  
  -- If rescheduling fields are set, ensure status is 'rescheduled'
  IF NEW.rescheduled_to_date IS NOT NULL AND NEW.status != 'rescheduled' THEN
    NEW.status := 'rescheduled';
  END IF;
  
  -- Log status change for debugging
  RAISE NOTICE 'Booking status change: % -> % (ID: %)', 
    OLD.status, NEW.status, NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Re-create trigger with updated function
CREATE TRIGGER validate_booking_status_trigger
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION validate_booking_status_change();

-- Create a function to properly cancel any booking regardless of status
CREATE OR REPLACE FUNCTION cancel_booking(
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
  WHERE id = booking_id;
  
  GET DIAGNOSTICS success = ROW_COUNT;
  RETURN success > 0;
END;
$$ LANGUAGE plpgsql;
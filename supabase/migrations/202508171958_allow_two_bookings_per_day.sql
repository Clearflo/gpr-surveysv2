-- Migration: Allow up to two bookings per day
-- Date: 2025-08-17
-- Description: Update check_booking_availability() to permit up to 2 non-cancelled, non-blocked bookings per date.

CREATE OR REPLACE FUNCTION check_booking_availability()
RETURNS TRIGGER AS $$
DECLARE
  today date := CURRENT_DATE;
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

  -- No same-day bookings
  IF NEW.date <= today THEN
    RAISE EXCEPTION 'Bookings must be made at least one day in advance (tomorrow or later)';
  END IF;

  -- Reject if date is blocked
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
      AND is_blocked = true
      AND status != 'cancelled'
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
  ) THEN
    RAISE EXCEPTION 'Date % is blocked and unavailable for booking', NEW.date;
  END IF;

  -- Allow up to two non-cancelled, non-blocked bookings per date
  IF (
    SELECT COUNT(1) FROM bookings 
    WHERE date = NEW.date 
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
      AND status != 'cancelled'
      AND cancelled_at IS NULL
      AND is_blocked = false
  ) >= 2 THEN
    RAISE EXCEPTION 'Date % already has two bookings. Maximum two bookings allowed per day.', NEW.date;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remove duration field and add booking_time field
-- This migration updates the booking system to use specific booking times instead of duration blocks

-- Drop the duration column
ALTER TABLE bookings DROP COLUMN IF EXISTS duration;

-- Add booking_time column to store the specific booking time
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_time TIME;

-- Update the existing start_time to booking_time if it exists
UPDATE bookings SET booking_time = start_time::TIME WHERE start_time IS NOT NULL;

-- Drop the start_time column as it's now replaced by booking_time
ALTER TABLE bookings DROP COLUMN IF EXISTS start_time;

-- Add comment to explain the new field
COMMENT ON COLUMN bookings.booking_time IS 'The specific time of the booking in HH:MM format';

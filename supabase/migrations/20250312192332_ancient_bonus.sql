/*
  # Update admin code for blocked bookings

  1. Changes
    - Update the admin code from GPR2024BLOCK to GPR2025BLOCK
    - Modify the check constraint to use the new code

  2. Security
    - Maintains existing RLS policies
    - Updates validation for blocked bookings
*/

-- Drop the existing constraint
ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS blocked_booking_requires_code;

-- Add the constraint with the new code
ALTER TABLE bookings
ADD CONSTRAINT blocked_booking_requires_code
CHECK (
  (is_blocked = false) OR 
  (is_blocked = true AND admin_code = 'GPR2025BLOCK')
);
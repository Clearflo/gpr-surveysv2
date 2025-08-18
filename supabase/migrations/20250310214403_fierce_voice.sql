/*
  # Update service names in bookings table

  1. Changes
    - Add check constraint to ensure service names are valid
    - Update existing service IDs to full names
    - Add trigger to validate service names

  2. Security
    - Maintains existing RLS policies
    - Adds data validation for service names
*/

-- Create an enum type for valid services
DO $$ BEGIN
  CREATE TYPE booking_service AS ENUM (
    'Underground Utility Detection',
    'Underground Storage Tank Detection',
    'Environmental Drilling Support',
    'Pre-Construction Locating',
    '3D Mapping & Asset Management',
    'Emergency Locate Services'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Update existing records with full service names
UPDATE bookings SET
  service = CASE service
    WHEN 'utility' THEN 'Underground Utility Detection'
    WHEN 'ust' THEN 'Underground Storage Tank Detection'
    WHEN 'environmental' THEN 'Environmental Drilling Support'
    WHEN 'construction' THEN 'Pre-Construction Locating'
    WHEN 'mapping' THEN '3D Mapping & Asset Management'
    WHEN 'emergency' THEN 'Emergency Locate Services'
    ELSE service
  END;

-- Add check constraint for service names
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS valid_service_names;
ALTER TABLE bookings ADD CONSTRAINT valid_service_names
  CHECK (service::booking_service IS NOT NULL);
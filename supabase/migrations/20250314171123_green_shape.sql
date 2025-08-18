/*
  # Fix postal code validation and field mappings

  1. Changes
    - Update postal code validation to handle spaces and hyphens
    - Add helper function to format postal codes
    - Update customer email handling
    - Add missing fields to bookings table

  2. Security
    - Maintains existing RLS policies
*/

-- Create function to format postal codes
CREATE OR REPLACE FUNCTION format_postal_code(code text)
RETURNS text AS $$
BEGIN
  -- Remove spaces and hyphens, convert to uppercase
  RETURN regexp_replace(upper(code), '[^A-Z0-9]', '', 'g');
END;
$$ LANGUAGE plpgsql;

-- Update postal code constraints to use formatted codes
ALTER TABLE customers DROP CONSTRAINT IF EXISTS valid_billing_postal_code;
ALTER TABLE customers ADD CONSTRAINT valid_billing_postal_code
  CHECK (format_postal_code(billing_postal_code) ~ '^[A-Z]\d[A-Z]\d[A-Z]\d$');

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS valid_site_postal_code;
ALTER TABLE bookings ADD CONSTRAINT valid_site_postal_code
  CHECK (format_postal_code(site_postal_code) ~ '^[A-Z]\d[A-Z]\d[A-Z]\d$');

-- Add missing fields to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS customer_email text,
ADD COLUMN IF NOT EXISTS customer_phone text;
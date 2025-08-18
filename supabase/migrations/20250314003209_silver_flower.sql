/*
  # Update address fields structure
  
  1. Changes
    - Split site_address into component fields
    - Split billing_address into component fields
    - Add new columns for structured address data
    - Maintain existing columns for backward compatibility
    
  2. Security
    - Maintains existing RLS policies
    - Adds validation for postal codes
*/

-- Add new site address columns
ALTER TABLE bookings
ADD COLUMN site_address_line1 text,
ADD COLUMN site_address_line2 text,
ADD COLUMN site_city text,
ADD COLUMN site_province text,
ADD COLUMN site_postal_code text,
ADD COLUMN site_country text DEFAULT 'Canada';

-- Add new billing address columns
ALTER TABLE bookings
ADD COLUMN billing_address_line1 text,
ADD COLUMN billing_address_line2 text,
ADD COLUMN billing_city text,
ADD COLUMN billing_province text,
ADD COLUMN billing_postal_code text,
ADD COLUMN billing_country text DEFAULT 'Canada';

-- Add postal code format check
ALTER TABLE bookings
ADD CONSTRAINT valid_site_postal_code
  CHECK (site_postal_code ~ '^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$'),
ADD CONSTRAINT valid_billing_postal_code
  CHECK (billing_postal_code ~ '^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$');
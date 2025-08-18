/*
  # Fix validation rules for emails and postal codes

  1. Changes
    - Update email validation to be less strict
    - Update postal code validation to handle formatting
    - Add helper functions for validation

  2. Security
    - Maintains existing RLS policies
    - Updates data validation rules
*/

-- Create function to validate email format
CREATE OR REPLACE FUNCTION is_valid_email(email text)
RETURNS boolean AS $$
BEGIN
  RETURN email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- Create function to format postal codes
CREATE OR REPLACE FUNCTION format_postal_code(code text)
RETURNS text AS $$
BEGIN
  -- Remove spaces and hyphens, convert to uppercase
  RETURN regexp_replace(upper(code), '[^A-Z0-9]', '', 'g');
END;
$$ LANGUAGE plpgsql;

-- Update email constraints
ALTER TABLE customers DROP CONSTRAINT IF EXISTS valid_email_format;
ALTER TABLE customers ADD CONSTRAINT valid_email_format
  CHECK (is_valid_email(email));

ALTER TABLE customers DROP CONSTRAINT IF EXISTS valid_billing_email_format;
ALTER TABLE customers ADD CONSTRAINT valid_billing_email_format
  CHECK (is_valid_email(billing_email));

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS valid_site_contact_email;
ALTER TABLE bookings ADD CONSTRAINT valid_site_contact_email
  CHECK (site_contact_email IS NULL OR is_valid_email(site_contact_email));

-- Update postal code constraints
ALTER TABLE customers DROP CONSTRAINT IF EXISTS valid_billing_postal_code;
ALTER TABLE customers ADD CONSTRAINT valid_billing_postal_code
  CHECK (format_postal_code(billing_postal_code) ~ '^[A-Z]\d[A-Z]\d[A-Z]\d$');

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS valid_site_postal_code;
ALTER TABLE bookings ADD CONSTRAINT valid_site_postal_code
  CHECK (format_postal_code(site_postal_code) ~ '^[A-Z]\d[A-Z]\d[A-Z]\d$');
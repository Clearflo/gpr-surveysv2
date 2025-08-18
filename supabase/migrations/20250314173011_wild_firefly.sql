/*
  # Fix validation and formatting issues

  1. Changes
    - Update email validation to be more lenient
    - Add proper postal code formatting
    - Add trigger to format data before validation
    - Update constraints to handle formatted data

  2. Security
    - Maintains existing RLS policies
    - Updates validation rules
*/

-- Drop existing triggers and functions to avoid conflicts
DROP TRIGGER IF EXISTS format_customer_data ON customers;
DROP TRIGGER IF EXISTS format_booking_data ON bookings;
DROP FUNCTION IF EXISTS format_data_trigger();
DROP FUNCTION IF EXISTS is_valid_email();
DROP FUNCTION IF EXISTS format_postal_code();

-- Create more lenient email validation
CREATE OR REPLACE FUNCTION is_valid_email(email text)
RETURNS boolean AS $$
BEGIN
  -- Basic email validation that accepts most common formats
  RETURN CASE 
    WHEN email IS NULL THEN false
    WHEN email = '' THEN false
    WHEN email !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN false
    ELSE true
  END;
END;
$$ LANGUAGE plpgsql;

-- Create postal code formatter
CREATE OR REPLACE FUNCTION format_postal_code(code text)
RETURNS text AS $$
DECLARE
  formatted text;
BEGIN
  -- Remove all non-alphanumeric characters and convert to uppercase
  formatted := upper(regexp_replace(code, '[^A-Za-z0-9]', '', 'g'));
  
  -- Return NULL if invalid format after cleaning
  IF formatted !~ '^[A-Z]\d[A-Z]\d[A-Z]\d$' THEN
    RETURN NULL;
  END IF;
  
  RETURN formatted;
END;
$$ LANGUAGE plpgsql;

-- Create function to format data before validation
CREATE OR REPLACE FUNCTION format_data_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Format emails
  IF TG_TABLE_NAME = 'customers' THEN
    -- Format customer emails
    NEW.email := lower(trim(NEW.email));
    NEW.billing_email := lower(trim(NEW.billing_email));
    -- Format postal code
    NEW.billing_postal_code := format_postal_code(NEW.billing_postal_code);
  END IF;

  IF TG_TABLE_NAME = 'bookings' THEN
    -- Format booking emails
    IF NEW.site_contact_email IS NOT NULL THEN
      NEW.site_contact_email := lower(trim(NEW.site_contact_email));
    END IF;
    IF NEW.customer_email IS NOT NULL THEN
      NEW.customer_email := lower(trim(NEW.customer_email));
    END IF;
    -- Format postal code
    NEW.site_postal_code := format_postal_code(NEW.site_postal_code);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to format data
CREATE TRIGGER format_customer_data
  BEFORE INSERT OR UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION format_data_trigger();

CREATE TRIGGER format_booking_data
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION format_data_trigger();

-- Update constraints to use formatted data
ALTER TABLE customers DROP CONSTRAINT IF EXISTS valid_email_format;
ALTER TABLE customers ADD CONSTRAINT valid_email_format
  CHECK (is_valid_email(email));

ALTER TABLE customers DROP CONSTRAINT IF EXISTS valid_billing_email_format;
ALTER TABLE customers ADD CONSTRAINT valid_billing_email_format
  CHECK (is_valid_email(billing_email));

ALTER TABLE customers DROP CONSTRAINT IF EXISTS valid_billing_postal_code;
ALTER TABLE customers ADD CONSTRAINT valid_billing_postal_code
  CHECK (billing_postal_code ~ '^[A-Z]\d[A-Z]\d[A-Z]\d$');

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS valid_site_contact_email;
ALTER TABLE bookings ADD CONSTRAINT valid_site_contact_email
  CHECK (site_contact_email IS NULL OR is_valid_email(site_contact_email));

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS valid_site_postal_code;
ALTER TABLE bookings ADD CONSTRAINT valid_site_postal_code
  CHECK (site_postal_code ~ '^[A-Z]\d[A-Z]\d[A-Z]\d$');
/*
  # Fix validation and formatting issues

  1. Changes
    - Update email validation to be more lenient
    - Add proper postal code formatting
    - Add trigger to format data before validation

  2. Security
    - Maintains existing RLS policies
    - Updates validation rules
*/

-- Update email validation to be more lenient
CREATE OR REPLACE FUNCTION is_valid_email(email text)
RETURNS boolean AS $$
BEGIN
  RETURN email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- Update postal code formatting to handle common formats
CREATE OR REPLACE FUNCTION format_postal_code(code text)
RETURNS text AS $$
BEGIN
  -- Remove spaces, hyphens, and lowercase letters
  RETURN regexp_replace(upper(code), '[^A-Z0-9]', '', 'g');
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to format data before validation
CREATE OR REPLACE FUNCTION format_data_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Format emails to lowercase and trim
  IF TG_TABLE_NAME = 'customers' THEN
    NEW.email := lower(trim(NEW.email));
    NEW.billing_email := lower(trim(NEW.billing_email));
  END IF;

  IF TG_TABLE_NAME = 'bookings' THEN
    IF NEW.site_contact_email IS NOT NULL THEN
      NEW.site_contact_email := lower(trim(NEW.site_contact_email));
    END IF;
    IF NEW.customer_email IS NOT NULL THEN
      NEW.customer_email := lower(trim(NEW.customer_email));
    END IF;
  END IF;

  -- Format postal codes
  IF TG_TABLE_NAME = 'customers' THEN
    NEW.billing_postal_code := format_postal_code(NEW.billing_postal_code);
  END IF;

  IF TG_TABLE_NAME = 'bookings' THEN
    NEW.site_postal_code := format_postal_code(NEW.site_postal_code);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to format data before validation
DROP TRIGGER IF EXISTS format_customer_data ON customers;
CREATE TRIGGER format_customer_data
  BEFORE INSERT OR UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION format_data_trigger();

DROP TRIGGER IF EXISTS format_booking_data ON bookings;
CREATE TRIGGER format_booking_data
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION format_data_trigger();
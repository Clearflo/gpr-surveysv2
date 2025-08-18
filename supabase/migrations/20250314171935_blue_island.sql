/*
  # Fix email validation and add formatting

  1. Changes
    - Update email validation function to be more robust
    - Add email formatting function
    - Update constraints to use formatted emails
    - Add trigger to format emails before insert/update

  2. Security
    - Maintains existing RLS policies
    - Improves data validation
*/

-- Create function to format email addresses
CREATE OR REPLACE FUNCTION format_email(email text)
RETURNS text AS $$
BEGIN
  -- Convert to lowercase and trim whitespace
  RETURN lower(trim(email));
END;
$$ LANGUAGE plpgsql;

-- Update email validation function to be more robust
CREATE OR REPLACE FUNCTION is_valid_email(email text)
RETURNS boolean AS $$
DECLARE
  formatted_email text;
BEGIN
  -- Format email first
  formatted_email := format_email(email);
  
  -- Basic email validation with common TLDs
  RETURN formatted_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    AND formatted_email !~ '\.{2,}'  -- No consecutive dots
    AND formatted_email !~ '@.*@'    -- Only one @ symbol
    AND length(formatted_email) <= 254;  -- Maximum email length
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to format emails before insert/update
CREATE OR REPLACE FUNCTION format_emails_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Format customer emails
  IF TG_TABLE_NAME = 'customers' THEN
    NEW.email := format_email(NEW.email);
    NEW.billing_email := format_email(NEW.billing_email);
  END IF;

  -- Format booking emails
  IF TG_TABLE_NAME = 'bookings' THEN
    NEW.site_contact_email := 
      CASE 
        WHEN NEW.site_contact_email IS NOT NULL 
        THEN format_email(NEW.site_contact_email)
        ELSE NULL
      END;
    NEW.customer_email := 
      CASE 
        WHEN NEW.customer_email IS NOT NULL 
        THEN format_email(NEW.customer_email)
        ELSE NULL
      END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for email formatting
DROP TRIGGER IF EXISTS format_customer_emails ON customers;
CREATE TRIGGER format_customer_emails
  BEFORE INSERT OR UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION format_emails_trigger();

DROP TRIGGER IF EXISTS format_booking_emails ON bookings;
CREATE TRIGGER format_booking_emails
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION format_emails_trigger();

-- Update email constraints to use formatted emails
ALTER TABLE customers DROP CONSTRAINT IF EXISTS valid_email_format;
ALTER TABLE customers ADD CONSTRAINT valid_email_format
  CHECK (is_valid_email(email));

ALTER TABLE customers DROP CONSTRAINT IF EXISTS valid_billing_email_format;
ALTER TABLE customers ADD CONSTRAINT valid_billing_email_format
  CHECK (is_valid_email(billing_email));

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS valid_site_contact_email;
ALTER TABLE bookings ADD CONSTRAINT valid_site_contact_email
  CHECK (site_contact_email IS NULL OR is_valid_email(site_contact_email));
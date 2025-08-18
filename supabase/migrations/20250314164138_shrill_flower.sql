/*
  # Update booking fields for separated names and addresses

  1. Changes
    - Add new name fields with default values
    - Update existing records with split names
    - Add constraints after data migration
    - Add validation for address fields

  2. Security
    - Maintains existing RLS policies
*/

-- Disable triggers temporarily to prevent conflicts
ALTER TABLE bookings DISABLE TRIGGER check_booking_availability_trigger;
ALTER TABLE bookings DISABLE TRIGGER update_addresses_trigger;

-- First ensure the columns exist
DO $$ 
BEGIN
  -- Add name columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'first_name') THEN
    ALTER TABLE bookings ADD COLUMN first_name text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'last_name') THEN
    ALTER TABLE bookings ADD COLUMN last_name text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'site_contact_first_name') THEN
    ALTER TABLE bookings ADD COLUMN site_contact_first_name text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'site_contact_last_name') THEN
    ALTER TABLE bookings ADD COLUMN site_contact_last_name text;
  END IF;
END $$;

-- Create function to split existing names
CREATE OR REPLACE FUNCTION split_full_name(full_name text)
RETURNS TABLE(first_name text, last_name text) AS $$
DECLARE
  name_parts text[];
BEGIN
  IF full_name IS NULL THEN
    RETURN QUERY SELECT NULL::text, NULL::text;
    RETURN;
  END IF;

  -- Split the full name on spaces
  name_parts := regexp_split_to_array(trim(full_name), '\s+');
  
  -- If only one part, use it as first name
  IF array_length(name_parts, 1) = 1 THEN
    RETURN QUERY SELECT name_parts[1]::text, NULL::text;
  -- If two or more parts, use first part as first name and rest as last name
  ELSE
    RETURN QUERY SELECT 
      name_parts[1]::text,
      array_to_string(name_parts[2:array_length(name_parts, 1)], ' ')::text;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Split existing names in bookings table
DO $$
DECLARE
  r RECORD;
  name_parts RECORD;
BEGIN
  FOR r IN SELECT id, client_name, site_contact_name FROM bookings 
  LOOP
    -- Split client name
    SELECT * INTO name_parts FROM split_full_name(r.client_name);
    UPDATE bookings 
    SET first_name = COALESCE(name_parts.first_name, 'Unknown'),
        last_name = COALESCE(name_parts.last_name, 'Unknown')
    WHERE id = r.id;
    
    -- Split site contact name
    SELECT * INTO name_parts FROM split_full_name(r.site_contact_name);
    UPDATE bookings 
    SET site_contact_first_name = COALESCE(name_parts.first_name, 'Unknown'),
        site_contact_last_name = COALESCE(name_parts.last_name, 'Unknown')
    WHERE id = r.id;
  END LOOP;
END $$;

-- Create function to combine names
CREATE OR REPLACE FUNCTION combine_names()
RETURNS TRIGGER AS $$
BEGIN
  -- Combine client names
  IF NEW.first_name IS NOT NULL THEN
    NEW.client_name := trim(COALESCE(NEW.first_name, '') || ' ' || COALESCE(NEW.last_name, ''));
  END IF;
  
  -- Combine site contact names
  IF NEW.site_contact_first_name IS NOT NULL THEN
    NEW.site_contact_name := trim(COALESCE(NEW.site_contact_first_name, '') || ' ' || COALESCE(NEW.site_contact_last_name, ''));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for name combinations
DROP TRIGGER IF EXISTS combine_names_trigger ON bookings;
CREATE TRIGGER combine_names_trigger
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION combine_names();

-- Add province validation
ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS valid_site_province;
ALTER TABLE bookings
ADD CONSTRAINT valid_site_province
  CHECK (site_province IS NULL OR site_province IN (
    'BC', 'AB', 'SK', 'MB', 'ON', 'QC', 'NB', 'NS', 'PE', 'NL', 'YT', 'NT', 'NU'
  ));

ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS valid_billing_province;
ALTER TABLE bookings
ADD CONSTRAINT valid_billing_province
  CHECK (billing_province IS NULL OR billing_province IN (
    'BC', 'AB', 'SK', 'MB', 'ON', 'QC', 'NB', 'NS', 'PE', 'NL', 'YT', 'NT', 'NU'
  ));

-- Add postal code validation
ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS valid_site_postal_code;
ALTER TABLE bookings
ADD CONSTRAINT valid_site_postal_code
  CHECK (site_postal_code ~ '^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$');

ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS valid_billing_postal_code;
ALTER TABLE bookings
ADD CONSTRAINT valid_billing_postal_code
  CHECK (billing_postal_code ~ '^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$');

-- Re-enable triggers
ALTER TABLE bookings ENABLE TRIGGER check_booking_availability_trigger;
ALTER TABLE bookings ENABLE TRIGGER update_addresses_trigger;
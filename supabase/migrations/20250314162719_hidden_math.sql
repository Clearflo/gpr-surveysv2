/*
  # Add separate first and last name fields
  
  1. Changes
    - Add first_name and last_name columns to bookings table
    - Add first_name and last_name columns to customers table
    - Add site_contact_first_name and site_contact_last_name to bookings table
    - Add trigger to maintain legacy name fields
  
  2. Security
    - Maintains existing RLS policies
*/

-- Disable triggers temporarily to prevent conflicts
ALTER TABLE bookings DISABLE TRIGGER check_booking_availability_trigger;

-- Add new name columns to bookings
ALTER TABLE bookings
ADD COLUMN first_name text,
ADD COLUMN last_name text,
ADD COLUMN site_contact_first_name text,
ADD COLUMN site_contact_last_name text;

-- Add new name columns to customers
ALTER TABLE customers
ADD COLUMN first_name text,
ADD COLUMN last_name text;

-- Create function to split existing names
CREATE OR REPLACE FUNCTION split_full_name(full_name text)
RETURNS TABLE(first_name text, last_name text) AS $$
DECLARE
  name_parts text[];
BEGIN
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
    SET first_name = name_parts.first_name,
        last_name = name_parts.last_name
    WHERE id = r.id;
    
    -- Split site contact name
    SELECT * INTO name_parts FROM split_full_name(r.site_contact_name);
    UPDATE bookings 
    SET site_contact_first_name = name_parts.first_name,
        site_contact_last_name = name_parts.last_name
    WHERE id = r.id;
  END LOOP;
END $$;

-- Split existing names in customers table
DO $$
DECLARE
  r RECORD;
  name_parts RECORD;
BEGIN
  FOR r IN SELECT id, name FROM customers 
  LOOP
    SELECT * INTO name_parts FROM split_full_name(r.name);
    UPDATE customers 
    SET first_name = name_parts.first_name,
        last_name = name_parts.last_name
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
CREATE TRIGGER combine_names_trigger
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION combine_names();

-- Re-enable triggers
ALTER TABLE bookings ENABLE TRIGGER check_booking_availability_trigger;
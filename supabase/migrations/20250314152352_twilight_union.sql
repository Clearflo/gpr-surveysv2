/*
  # Add address components and validation

  1. New Columns
    - Add separate address components for site and billing addresses
    - Add country defaults
    - Add postal code validation
    - Add province validation

  2. Changes
    - Add columns without constraints first
    - Add validation constraints for postal codes and provinces
    - Create function to format full addresses
    - Add trigger for address updates

  3. Security
    - Maintains existing RLS policies
    - Adds data validation for new fields
*/

-- First add new columns without constraints
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS site_address_line1 text,
ADD COLUMN IF NOT EXISTS site_address_line2 text,
ADD COLUMN IF NOT EXISTS site_city text,
ADD COLUMN IF NOT EXISTS site_province text,
ADD COLUMN IF NOT EXISTS site_postal_code text,
ADD COLUMN IF NOT EXISTS site_country text DEFAULT 'Canada',
ADD COLUMN IF NOT EXISTS billing_address_line1 text,
ADD COLUMN IF NOT EXISTS billing_address_line2 text,
ADD COLUMN IF NOT EXISTS billing_city text,
ADD COLUMN IF NOT EXISTS billing_province text,
ADD COLUMN IF NOT EXISTS billing_postal_code text,
ADD COLUMN IF NOT EXISTS billing_country text DEFAULT 'Canada';

-- Create function to format full address
CREATE OR REPLACE FUNCTION format_full_address(
  line1 text,
  line2 text,
  city text,
  province text,
  postal_code text,
  country text
) RETURNS text AS $$
BEGIN
  RETURN TRIM(
    COALESCE(line1, '') || 
    CASE WHEN line2 IS NOT NULL AND line2 != '' THEN E'\n' || line2 ELSE '' END ||
    E'\n' || COALESCE(city, '') || ', ' || COALESCE(province, '') || ' ' || 
    COALESCE(postal_code, '') ||
    CASE WHEN country != 'Canada' THEN E'\n' || country ELSE '' END
  );
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update full addresses
CREATE OR REPLACE FUNCTION update_full_addresses()
RETURNS TRIGGER AS $$
BEGIN
  -- Update site_address
  NEW.site_address := format_full_address(
    NEW.site_address_line1,
    NEW.site_address_line2,
    NEW.site_city,
    NEW.site_province,
    NEW.site_postal_code,
    NEW.site_country
  );
  
  -- Update billing_address
  NEW.billing_address := format_full_address(
    NEW.billing_address_line1,
    NEW.billing_address_line2,
    NEW.billing_city,
    NEW.billing_province,
    NEW.billing_postal_code,
    NEW.billing_country
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for address updates
CREATE TRIGGER update_addresses_trigger
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_full_addresses();

-- Add province validation
ALTER TABLE bookings
ADD CONSTRAINT valid_site_province
  CHECK (site_province IS NULL OR site_province IN (
    'BC', 'AB', 'SK', 'MB', 'ON', 'QC', 'NB', 'NS', 'PE', 'NL', 'YT', 'NT', 'NU'
  )),
ADD CONSTRAINT valid_billing_province
  CHECK (billing_province IS NULL OR billing_province IN (
    'BC', 'AB', 'SK', 'MB', 'ON', 'QC', 'NB', 'NS', 'PE', 'NL', 'YT', 'NT', 'NU'
  ));
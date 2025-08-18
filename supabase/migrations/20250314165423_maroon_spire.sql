/*
  # Complete rebuild of booking system

  1. New Tables
    - `customers`
      - Properly separated name fields
      - Structured address fields
      - Contact information
    - `bookings`
      - Structured address fields
      - Split name fields
      - Better validation rules
      - Status tracking
      - Improved relationships

  2. Security
    - Maintain existing RLS policies
    - Add data validation
*/

-- Drop existing tables and types
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TYPE IF EXISTS booking_service CASCADE;

-- Create booking service enum
CREATE TYPE booking_service AS ENUM (
  'Underground Utility Detection',
  'Underground Storage Tank Detection',
  'Environmental Drilling Support',
  'Pre-Construction Locating',
  '3D Mapping & Asset Management',
  'Emergency Locate Services'
);

-- Create customers table
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  company text,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  billing_email text NOT NULL,
  billing_address_line1 text NOT NULL,
  billing_address_line2 text,
  billing_city text NOT NULL,
  billing_province text NOT NULL,
  billing_postal_code text NOT NULL,
  billing_country text NOT NULL DEFAULT 'Canada',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_billing_province CHECK (
    billing_province IN ('BC', 'AB', 'SK', 'MB', 'ON', 'QC', 'NB', 'NS', 'PE', 'NL', 'YT', 'NT', 'NU')
  ),
  CONSTRAINT valid_billing_postal_code CHECK (
    billing_postal_code ~ '^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$'
  ),
  CONSTRAINT valid_email_format CHECK (
    email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  ),
  CONSTRAINT valid_billing_email_format CHECK (
    billing_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  )
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id),
  service booking_service NOT NULL,
  duration text NOT NULL,
  project_details text,
  bc1_call_number text,
  date date NOT NULL,
  end_date date,
  site_contact_first_name text NOT NULL,
  site_contact_last_name text NOT NULL,
  site_contact_phone text NOT NULL,
  site_contact_email text,
  site_address_line1 text NOT NULL,
  site_address_line2 text,
  site_city text NOT NULL,
  site_province text NOT NULL,
  site_postal_code text NOT NULL,
  site_country text NOT NULL DEFAULT 'Canada',
  notes text,
  payment_method text NOT NULL,
  purchase_order text,
  status text NOT NULL DEFAULT 'pending',
  is_blocked boolean DEFAULT false,
  admin_code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_duration CHECK (
    duration IN ('under-4', 'over-4')
  ),
  CONSTRAINT valid_payment_method CHECK (
    payment_method IN ('credit-card', 'cheque', 'e-transfer', 'purchase-order')
  ),
  CONSTRAINT valid_status CHECK (
    status IN ('pending', 'confirmed', 'completed', 'cancelled')
  ),
  CONSTRAINT valid_site_province CHECK (
    site_province IN ('BC', 'AB', 'SK', 'MB', 'ON', 'QC', 'NB', 'NS', 'PE', 'NL', 'YT', 'NT', 'NU')
  ),
  CONSTRAINT valid_site_postal_code CHECK (
    site_postal_code ~ '^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$'
  ),
  CONSTRAINT blocked_booking_requires_code CHECK (
    (is_blocked = false) OR (is_blocked = true AND admin_code = 'GPR2025BLOCK')
  ),
  CONSTRAINT valid_site_contact_email CHECK (
    site_contact_email IS NULL OR 
    site_contact_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  )
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public to create customers"
  ON customers FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to read customers"
  ON customers FOR SELECT TO public
  USING (true);

CREATE POLICY "Allow public to create bookings"
  ON bookings FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to read bookings"
  ON bookings FOR SELECT TO public
  USING (true);

-- Create indexes
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_customers_email ON customers(email);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create booking availability check
CREATE OR REPLACE FUNCTION check_booking_availability()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the date is blocked
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
    AND is_blocked = true
  ) THEN
    RAISE EXCEPTION 'Date % is blocked and unavailable for booking', NEW.date;
  END IF;

  -- Check existing bookings
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
    AND duration = 'over-4'
  ) THEN
    RAISE EXCEPTION 'Date % is already fully booked', NEW.date;
  END IF;

  -- Check for long booking conflicts
  IF NEW.duration = 'over-4' AND EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
  ) THEN
    RAISE EXCEPTION 'Cannot book full day when other bookings exist on %', NEW.date;
  END IF;

  -- Check for maximum short bookings
  IF NEW.duration = 'under-4' AND (
    SELECT COUNT(*) FROM bookings 
    WHERE date = NEW.date 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
  ) >= 2 THEN
    RAISE EXCEPTION 'Maximum two half-day bookings allowed on %', NEW.date;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_booking_availability_trigger
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_booking_availability();
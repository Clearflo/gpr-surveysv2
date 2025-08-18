/*
  # Create bookings schema

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `service` (text) - Type of service requested
      - `duration` (text) - Under or over 4 hours
      - `project_details` (text) - Project description
      - `bc1_call_number` (text) - BC1 call reference
      - `date` (date) - Scheduled date
      - `site_address` (text) - Location address
      - `site_contact_name` (text) - On-site contact
      - `site_contact_phone` (text) - Contact phone
      - `site_contact_email` (text) - Contact email
      - `notes` (text) - Additional notes
      - `client_name` (text) - Client's full name
      - `client_company` (text) - Company name
      - `client_phone` (text) - Client phone
      - `client_email` (text) - Client email
      - `billing_email` (text) - Billing email
      - `billing_address` (text) - Billing address
      - `billing_instructions` (text) - Special billing instructions
      - `payment_method` (text) - Payment method
      - `purchase_order` (text) - PO number if applicable
      - `status` (text) - Booking status
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `bookings` table
    - Add policies for public access (since this is a public booking system)
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text NOT NULL,
  duration text NOT NULL,
  project_details text,
  bc1_call_number text,
  date date NOT NULL,
  site_address text NOT NULL,
  site_contact_name text NOT NULL,
  site_contact_phone text NOT NULL,
  site_contact_email text,
  notes text,
  client_name text NOT NULL,
  client_company text,
  client_phone text NOT NULL,
  client_email text NOT NULL,
  billing_email text NOT NULL,
  billing_address text NOT NULL,
  billing_instructions text,
  payment_method text NOT NULL,
  purchase_order text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting new bookings (public access)
CREATE POLICY "Allow public to create bookings"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for reading bookings (public access to check availability)
CREATE POLICY "Allow public to read bookings"
  ON bookings
  FOR SELECT
  TO public
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
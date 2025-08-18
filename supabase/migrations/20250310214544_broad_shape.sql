/*
  # Create customers table and update bookings

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `company` (text, nullable)
      - `phone` (text)
      - `email` (text)
      - `billing_email` (text)
      - `billing_address` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes
    - Add customer_id foreign key to bookings table
    - Add trigger for updated_at timestamp

  3. Security
    - Enable RLS on customers table
    - Add policies for customer access
*/

-- Create customers table
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  phone text NOT NULL,
  email text NOT NULL,
  billing_email text NOT NULL,
  billing_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add updated_at trigger
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add customer_id to bookings
ALTER TABLE bookings 
ADD COLUMN customer_id uuid REFERENCES customers(id);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public to create customers"
  ON customers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to read customers"
  ON customers
  FOR SELECT
  TO public
  USING (true);

-- Create unique constraints
ALTER TABLE customers
ADD CONSTRAINT unique_customer_email UNIQUE (email);

-- Create indexes
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
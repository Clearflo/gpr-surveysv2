/*
  # Create admin tables and policies

  1. New Tables
    - `employees`
      - `id` (uuid, primary key)
      - `auth_id` (uuid, references auth.users)
      - `name` (text)
      - `email` (text, unique)
      - `role` (text, enum: admin)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on employees table
    - Add policies for admin access
*/

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role = 'admin'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all employees"
  ON employees
  FOR SELECT
  TO authenticated
  USING (role = 'admin');

CREATE POLICY "Admins can update own profile"
  ON employees
  FOR UPDATE
  TO authenticated
  USING (auth_id = auth.uid())
  WITH CHECK (role = 'admin');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
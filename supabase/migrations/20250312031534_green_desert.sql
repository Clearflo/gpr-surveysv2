/*
  # Update employee email address

  1. Changes
    - Update email address for existing admin user
    - Add check constraint to ensure email format
  
  2. Security
    - Maintains existing RLS policies
*/

-- Update the email address for the admin user
UPDATE employees 
SET email = 'liam.shandro@clearflo.ai'
WHERE email = 'liam.shandro@gmail.com';

-- Add email format check constraint
ALTER TABLE employees
ADD CONSTRAINT valid_email_format
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
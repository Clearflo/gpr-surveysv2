/*
  # Create Initial Admin User

  1. Changes
    - Creates initial admin user in employees table
    - Sets up admin role and permissions

  2. Security
    - Admin user will have full access to dashboard
    - Email verification is disabled for this initial setup
*/

-- First check if the user already exists to avoid duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM employees WHERE email = 'liam.shandro@gmail.com'
  ) THEN
    -- Insert the admin user
    INSERT INTO employees (
      name,
      email,
      role,
      created_at,
      updated_at
    ) VALUES (
      'Liam Shandro',
      'liam.shandro@gmail.com',
      'admin',
      now(),
      now()
    );
  END IF;
END $$;
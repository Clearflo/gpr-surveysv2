/*
  # Self-service modify booking (Phase 1)

  - Adds RPCs:
    * fetch_booking_self(job_number text, email text)
    * update_booking_self(payload jsonb)
    * add_booking_file(job_number text, email text, url text)
  - Adds table booking_files to associate uploaded files with bookings
  - No RLS changes in this phase
*/

-- booking_files table
CREATE TABLE IF NOT EXISTS booking_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_booking_files_booking_id ON booking_files(booking_id);

-- Helper: normalize email
CREATE OR REPLACE FUNCTION normalize_email(text) RETURNS text AS $$
  SELECT lower(trim($1));
$$ LANGUAGE sql IMMUTABLE;

-- Fetch booking by job_number + email with safe projection
DROP FUNCTION IF EXISTS fetch_booking_self(text, text);
CREATE OR REPLACE FUNCTION fetch_booking_self(p_job_number text, p_email text)
RETURNS TABLE (
  booking_id uuid,
  job_number text,
  service text,
  project_details text,
  date date,
  booking_time time,
  status text,
  bc1_call_number text,
  notes text,
  payment_method text,
  purchase_order text,
  site_contact_first_name text,
  site_contact_last_name text,
  site_contact_phone text,
  site_contact_email text,
  site_address_line1 text,
  site_address_line2 text,
  site_city text,
  site_province text,
  site_postal_code text,
  site_country text,
  customer_id uuid,
  customer_email text,
  customer_phone text,
  billing_email text,
  billing_address_line1 text,
  billing_address_line2 text,
  billing_city text,
  billing_province text,
  billing_postal_code text,
  billing_country text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.job_number,
    b.service::text,
    b.project_details,
    b.date,
    b.booking_time,
    b.status,
    b.bc1_call_number,
    b.notes,
    b.payment_method,
    b.purchase_order,
    b.site_contact_first_name,
    b.site_contact_last_name,
    b.site_contact_phone,
    b.site_contact_email,
    b.site_address_line1,
    b.site_address_line2,
    b.site_city,
    b.site_province,
    b.site_postal_code,
    b.site_country,
    b.customer_id,
    b.customer_email,
    b.customer_phone,
    c.billing_email,
    c.billing_address_line1,
    c.billing_address_line2,
    c.billing_city,
    c.billing_province,
    c.billing_postal_code,
    c.billing_country
  FROM bookings b
  LEFT JOIN customers c ON c.id = b.customer_id
  WHERE b.job_number = p_job_number
    AND (
      normalize_email(b.customer_email) = normalize_email(p_email)
      OR (c.email IS NOT NULL AND normalize_email(c.email) = normalize_email(p_email))
    )
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- Update booking and customer billing info via JSON payload
-- Expected payload keys:
--   job_number, email (required)
--   booking_updates: { date, booking_time, project_details, bc1_call_number, notes, payment_method, purchase_order,
--                      site_contact_first_name, site_contact_last_name, site_contact_phone, site_contact_email,
--                      site_address_line1, site_address_line2, site_city, site_province, site_postal_code, site_country }
--   customer_updates: { billing_email, billing_address_line1, billing_address_line2, billing_city, billing_province, billing_postal_code, billing_country }
DROP FUNCTION IF EXISTS update_booking_self(jsonb);
CREATE OR REPLACE FUNCTION update_booking_self(p_payload jsonb)
RETURNS TABLE (updated boolean) AS $$
DECLARE
  v_job_number text := p_payload->>'job_number';
  v_email text := p_payload->>'email';
  v_booking_id uuid;
  v_customer_id uuid;
  v_prev_date date;
  v_prev_time time;
  v_new_date date := NULLIF((p_payload->'booking_updates'->>'date'), '')::date;
  v_new_time time := NULLIF((p_payload->'booking_updates'->>'booking_time'), '')::time;
  v_status text;
BEGIN
  -- locate booking + customer by job_number + email
  SELECT b.id, b.customer_id, b.date, b.booking_time, b.status
    INTO v_booking_id, v_customer_id, v_prev_date, v_prev_time, v_status
  FROM bookings b
  LEFT JOIN customers c ON c.id = b.customer_id
  WHERE b.job_number = v_job_number
    AND (
      normalize_email(b.customer_email) = normalize_email(v_email)
      OR (c.email IS NOT NULL AND normalize_email(c.email) = normalize_email(v_email))
    )
  LIMIT 1;

  IF v_booking_id IS NULL THEN
    RAISE EXCEPTION 'No booking matches the provided job number and email';
  END IF;

  -- disallow edits to cancelled or blocked bookings
  IF v_status = 'cancelled' THEN
    RAISE EXCEPTION 'Cannot modify a cancelled booking';
  END IF;
  IF EXISTS (SELECT 1 FROM bookings WHERE id = v_booking_id AND is_blocked = true) THEN
    RAISE EXCEPTION 'Cannot modify an admin-blocked booking';
  END IF;

  -- If date is changing, enforce: no same-day and one-per-day for public
  IF v_new_date IS NOT NULL AND v_new_date <> v_prev_date THEN
    IF v_new_date <= CURRENT_DATE THEN
      RAISE EXCEPTION 'Changes must be made for tomorrow or later';
    END IF;

    -- disallow reschedule to blocked date
    IF EXISTS (
      SELECT 1 FROM bookings
      WHERE date = v_new_date AND is_blocked = true AND status != 'cancelled'
    ) THEN
      RAISE EXCEPTION 'Selected date is blocked and unavailable';
    END IF;

    -- public rule: only allow if there are zero other regular bookings on that date
    IF EXISTS (
      SELECT 1 FROM bookings
      WHERE date = v_new_date
        AND id <> v_booking_id
        AND status != 'cancelled'
        AND cancelled_at IS NULL
        AND (is_blocked IS NULL OR is_blocked = false)
    ) THEN
      RAISE EXCEPTION 'Selected date already has a booking';
    END IF;
  END IF;

  -- Perform booking update
  UPDATE bookings b
  SET
    project_details = COALESCE(p_payload->'booking_updates'->>'project_details', b.project_details),
    bc1_call_number = COALESCE(p_payload->'booking_updates'->>'bc1_call_number', b.bc1_call_number),
    notes = COALESCE(p_payload->'booking_updates'->>'notes', b.notes),
    payment_method = COALESCE(p_payload->'booking_updates'->>'payment_method', b.payment_method),
    purchase_order = COALESCE(p_payload->'booking_updates'->>'purchase_order', b.purchase_order),
    site_contact_first_name = COALESCE(p_payload->'booking_updates'->>'site_contact_first_name', b.site_contact_first_name),
    site_contact_last_name = COALESCE(p_payload->'booking_updates'->>'site_contact_last_name', b.site_contact_last_name),
    site_contact_phone = COALESCE(p_payload->'booking_updates'->>'site_contact_phone', b.site_contact_phone),
    site_contact_email = COALESCE(p_payload->'booking_updates'->>'site_contact_email', b.site_contact_email),
    site_address_line1 = COALESCE(p_payload->'booking_updates'->>'site_address_line1', b.site_address_line1),
    site_address_line2 = COALESCE(p_payload->'booking_updates'->>'site_address_line2', b.site_address_line2),
    site_city = COALESCE(p_payload->'booking_updates'->>'site_city', b.site_city),
    site_province = COALESCE(p_payload->'booking_updates'->>'site_province', b.site_province),
    site_postal_code = COALESCE(p_payload->'booking_updates'->>'site_postal_code', b.site_postal_code),
    site_country = COALESCE(p_payload->'booking_updates'->>'site_country', b.site_country),
    date = COALESCE(v_new_date, b.date),
    booking_time = COALESCE(v_new_time, b.booking_time),
    updated_at = now(),
    -- Mark reschedule if date/time changed
    status = CASE WHEN (v_new_date IS NOT NULL AND v_new_date <> v_prev_date) OR (v_new_time IS NOT NULL AND v_new_time <> v_prev_time) THEN 'rescheduled' ELSE b.status END,
    rescheduled_from_date = CASE WHEN (v_new_date IS NOT NULL AND v_new_date <> v_prev_date) THEN v_prev_date ELSE b.rescheduled_from_date END,
    rescheduled_to_date = CASE WHEN (v_new_date IS NOT NULL AND v_new_date <> v_prev_date) THEN v_new_date ELSE b.rescheduled_to_date END,
    rescheduled_at = CASE WHEN (v_new_date IS NOT NULL AND v_new_date <> v_prev_date) OR (v_new_time IS NOT NULL AND v_new_time <> v_prev_time) THEN now() ELSE b.rescheduled_at END,
    rescheduled_by = CASE WHEN (v_new_date IS NOT NULL AND v_new_date <> v_prev_date) OR (v_new_time IS NOT NULL AND v_new_time <> v_prev_time) THEN 'self-service' ELSE b.rescheduled_by END
  WHERE b.id = v_booking_id;

  -- Perform customer billing update if provided and customer exists
  IF v_customer_id IS NOT NULL AND (p_payload ? 'customer_updates') THEN
    UPDATE customers c
    SET
      billing_email = COALESCE(p_payload->'customer_updates'->>'billing_email', c.billing_email),
      billing_address_line1 = COALESCE(p_payload->'customer_updates'->>'billing_address_line1', c.billing_address_line1),
      billing_address_line2 = COALESCE(p_payload->'customer_updates'->>'billing_address_line2', c.billing_address_line2),
      billing_city = COALESCE(p_payload->'customer_updates'->>'billing_city', c.billing_city),
      billing_province = COALESCE(p_payload->'customer_updates'->>'billing_province', c.billing_province),
      billing_postal_code = COALESCE(p_payload->'customer_updates'->>'billing_postal_code', c.billing_postal_code),
      billing_country = COALESCE(p_payload->'customer_updates'->>'billing_country', c.billing_country),
      updated_at = now()
    WHERE c.id = v_customer_id;
  END IF;

  RETURN QUERY SELECT true::boolean;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Add booking file association after verification
DROP FUNCTION IF EXISTS add_booking_file(text, text, text);
CREATE OR REPLACE FUNCTION add_booking_file(p_job_number text, p_email text, p_url text)
RETURNS TABLE (added boolean) AS $$
DECLARE
  v_booking_id uuid;
BEGIN
  SELECT b.id
    INTO v_booking_id
  FROM bookings b
  LEFT JOIN customers c ON c.id = b.customer_id
  WHERE b.job_number = p_job_number
    AND (
      normalize_email(b.customer_email) = normalize_email(p_email)
      OR (c.email IS NOT NULL AND normalize_email(c.email) = normalize_email(p_email))
    )
  LIMIT 1;

  IF v_booking_id IS NULL THEN
    RAISE EXCEPTION 'No booking matches the provided job number and email';
  END IF;

  INSERT INTO booking_files(booking_id, url) VALUES (v_booking_id, p_url);
  RETURN QUERY SELECT true::boolean;
END;
$$ LANGUAGE plpgsql VOLATILE;

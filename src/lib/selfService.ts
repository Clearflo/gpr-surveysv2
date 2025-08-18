import { supabase } from './supabase';

export type FetchBookingSelfRow = {
  booking_id: string;
  job_number: string | null;
  service: string;
  project_details: string | null;
  date: string;
  booking_time: string | null;
  status: string;
  bc1_call_number: string | null;
  notes: string | null;
  payment_method: string;
  purchase_order: string | null;
  site_contact_first_name: string;
  site_contact_last_name: string;
  site_contact_phone: string;
  site_contact_email: string | null;
  site_address_line1: string;
  site_address_line2: string | null;
  site_city: string;
  site_province: string;
  site_postal_code: string;
  site_country: string;
  customer_id: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  billing_email: string | null;
  billing_address_line1: string | null;
  billing_address_line2: string | null;
  billing_city: string | null;
  billing_province: string | null;
  billing_postal_code: string | null;
  billing_country: string | null;
};

export async function fetchBookingSelf(jobNumber: string, email: string) {
  const { data, error } = await supabase.rpc('fetch_booking_self', {
    p_job_number: jobNumber,
    p_email: email,
  });
  if (error) throw error;
  // RPC returns a single row via RETURNS TABLE with LIMIT 1; supabase returns array
  if (Array.isArray(data) && data.length > 0) {
    return data[0] as FetchBookingSelfRow;
  }
  return undefined;
}

export type UpdateBookingSelfPayload = {
  job_number: string;
  email: string;
  booking_updates?: Partial<{
    date: string;
    booking_time: string;
    project_details: string;
    bc1_call_number: string;
    notes: string;
    payment_method: string;
    purchase_order: string;
    site_contact_first_name: string;
    site_contact_last_name: string;
    site_contact_phone: string;
    site_contact_email: string;
    site_address_line1: string;
    site_address_line2: string;
    site_city: string;
    site_province: string;
    site_postal_code: string;
    site_country: string;
  }>;
  customer_updates?: Partial<{
    billing_email: string;
    billing_address_line1: string;
    billing_address_line2: string;
    billing_city: string;
    billing_province: string;
    billing_postal_code: string;
    billing_country: string;
  }>;
};

export async function updateBookingSelf(payload: UpdateBookingSelfPayload) {
  const { data, error } = await supabase.rpc('update_booking_self', {
    p_payload: payload,
  });
  if (error) throw error;
  return (data || null) as { updated: boolean }[] | null;
}

export async function addBookingFile(jobNumber: string, email: string, url: string) {
  const { data, error } = await supabase.rpc('add_booking_file', {
    p_job_number: jobNumber,
    p_email: email,
    p_url: url,
  });
  if (error) throw error;
  return (data || null) as { added: boolean }[] | null;
}

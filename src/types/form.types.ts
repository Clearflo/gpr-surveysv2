// Form-related types for the booking system

export interface BookingFormData {
  // Customer Info
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  phone: string;
  
  // Billing Info
  billing_email: string;
  billing_address_line1: string;
  billing_address_line2: string;
  billing_city: string;
  billing_province: string;
  billing_postal_code: string;
  billing_instructions: string;
  
  // Service Details
  service: string;
  project_details: string;
  bc1_call_number: string;
  date: string;
  booking_time: string;
  
  // Site Contact
  site_contact_first_name: string;
  site_contact_last_name: string;
  site_contact_phone: string;
  site_contact_email: string;
  
  // Site Location
  site_address_line1: string;
  site_address_line2: string;
  site_city: string;
  site_province: string;
  site_postal_code: string;
  
  // Additional Info
  notes: string;
  payment_method: string;
  purchase_order: string;
  site_plans: string[];
}

export interface FileUploadState {
  files: File[];
  uploading: boolean;
  error: string | null;
  isDragging: boolean;
}

export interface StepCompletionState {
  1: boolean; // Service Selection
  2: boolean; // Customer Info
  3: boolean; // Billing Info
  4: boolean; // Site Info
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
}

export interface EstimateRequestFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  service_type: string;
  project_location: string;
  project_size: string;
  project_timeline: string;
  project_description: string;
  budget_range: string;
  additional_services: string[];
}

// Admin forms
export interface AdminBlockingFormData {
  date: string;
  reason: string;
  admin_code: string;
}

export interface AdminRescheduleFormData {
  booking_id: string;
  new_date: string;
  new_time: string;
  reason: string;
  notify_customer: boolean;
}

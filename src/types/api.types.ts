// API response and error types

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

// API error structure
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// Supabase-specific error
export interface SupabaseError {
  code: string;
  message: string;
  details: string | null;
  hint: string | null;
}

// Webhook response types
export interface WebhookResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// File upload response
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
}

// Booking API responses
export interface CreateBookingResponse {
  booking: {
    id: string;
    job_number: string;
    date: string;
    booking_time: string | null;
    service: string;
    status: string;
  };
  customer: {
    id: string;
    email: string;
    isExisting: boolean;
  };
}

export interface CheckAvailabilityResponse {
  available: boolean;
  reason?: string;
  existingBookings?: Array<{
    id: string;
    time: string | null;
  }>;
}

export interface GetBookingsResponse {
  bookings: Array<{
    id: string;
    date: string;
    booking_time: string | null;
    service: string;
    status: string;
    customer_email: string;
    is_blocked: boolean;
  }>;
  total: number;
}

// Contact form response
export interface ContactSubmissionResponse {
  id: string;
  created_at: string;
  message: string;
}

// Estimate request response
export interface EstimateRequestResponse {
  id: string;
  created_at: string;
  service_type: string;
  message: string;
}

// Admin action responses
export interface AdminActionResponse {
  success: boolean;
  action: string;
  affectedBookingId?: string;
  message: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

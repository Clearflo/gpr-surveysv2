// Booking-related types

import { Database } from './database.types';

// Database row types
export type Booking = Database['public']['Tables']['bookings']['Row'];
export type Customer = Database['public']['Tables']['customers']['Row'];

// Insert types for creating new records
export type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
export type CustomerInsert = Database['public']['Tables']['customers']['Insert'];

// Booking with customer relationship
export interface BookingWithCustomer extends Booking {
  customer: Customer | null;
}

// Calendar-related types
export interface TimeSlot {
  time: string;
  display: string;
  available: boolean;
}

export interface CalendarDay {
  date: Date;
  dateString: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  isSelectable: boolean;
  hasBooking: boolean;
  bookings?: Booking[];
}

// Webhook payload types
export interface BookingWebhookPayload {
  // Booking info
  bookingId: string;
  jobNumber: string | null;
  
  // Customer Info
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  
  // Billing Info
  billingEmail: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingCity: string;
  billingProvince: string;
  billingPostalCode: string;
  billingInstructions: string;
  
  // Service Details
  service: string;
  duration: string;
  projectDetails: string;
  bc1CallNumber: string;
  date: string;
  startTime: string;
  startTimeFormatted: string;
  
  // Site Contact
  siteContactFirstName: string;
  siteContactLastName: string;
  siteContactPhone: string;
  siteContactEmail: string;
  
  // Site Location
  siteAddressLine1: string;
  siteAddressLine2: string;
  siteCity: string;
  siteProvince: string;
  sitePostalCode: string;
  
  // Additional Info
  notes: string;
  paymentMethod: string;
  purchaseOrder: string;
  
  // Files
  siteFiles: string[];
  fileCount: number;
  filesUploaded: boolean;
  
  // Flags
  isExistingCustomer: boolean;
  isBlockedBooking: boolean;
}

// Admin action types
export interface AdminBlockAction {
  date: string;
  reason: string;
  blockedBy: string;
  blockedAt: string;
}

export interface AdminCancelAction {
  bookingId: string;
  reason: string;
  cancelledBy: string;
  notifyCustomer: boolean;
}

export interface AdminRescheduleAction {
  bookingId: string;
  originalDate: string;
  newDate: string;
  newTime: string;
  reason: string;
  rescheduledBy: string;
  notifyCustomer: boolean;
}

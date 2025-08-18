import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

// Strict validator for DB operations (must be non-empty and valid)
const validEmail = (email: string): boolean => {
  const e = (email || '').trim().toLowerCase();
  return e.length > 0 && /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(e);
};

/**
 * Validates a Canadian postal code format
 * @param {string} code - Postal code to validate
 * @returns {boolean} True if valid postal code format or empty
 */
// (optional) postal code validator is handled in UI; DB stores normalized via formatPostalCode

/**
 * Formats a postal code to uppercase and removes non-alphanumeric characters
 * @param {string} code - Postal code to format
 * @returns {string} Formatted postal code
 */
const formatPostalCode = (code: string): string => {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, '');
};

// Map UI service labels/values to DB enum values
const normalizeService = (service: string): string => {
  switch (service) {
    case 'Subsurface Utility Locating & Scanning':
      return 'Underground Utility Detection';
    case 'Underground Storage Tank Detection':
      return 'Underground Storage Tank Detection';
    default:
      return service;
  }
};

// Payload used by the booking form combines booking fields with customer fields
type CreateBookingPayload = Database['public']['Tables']['bookings']['Insert'] & {
  // customer fields collected in the form
  first_name: string;
  last_name: string;
  company?: string | null;
  phone: string;
  email: string;
  billing_email: string;
  billing_address_line1?: string | null;
  billing_address_line2?: string | null;
  billing_city?: string | null;
  billing_province?: string | null;
  billing_postal_code?: string | null;
  billing_instructions?: string | null;
  // optional time field from UI
  booking_time?: string | null;
  // admin-only flag: mark a row as a blocked day
  is_blocked?: boolean;
};

/**
 * Custom hook for managing bookings operations
 * Provides functions to create bookings, check availability, and manage customer data
 * 
 * @returns {Object} Booking management utilities
 * @returns {Function} createBooking - Creates a new booking with customer data
 * @returns {Function} checkDateAvailability - Checks if a date is available for booking
 * @returns {Function} checkCustomerExists - Verifies if a customer exists by email
 * @returns {boolean} isLoading - Loading state for async operations
 * @returns {string|null} error - Error message if operation fails
 * 
 * @example
 * const { createBooking, checkDateAvailability, isLoading, error } = useBookings();
 * 
 * // Check availability
 * const isAvailable = await checkDateAvailability('2025-06-15');
 * 
 * // Create booking
 * const booking = await createBooking(bookingData);
 */
export function useBookings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Checks if a date is available for booking
   * 
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<boolean>} True if date is available
   */
  const checkDateAvailability = async (date: string, mode: 'public' | 'admin' = 'public') => {
    try {
      // Count non-cancelled real bookings (exclude cancelled)
      const { data: regular, error: regErr } = await supabase
        .from('bookings')
        .select('id')
        .eq('date', date)
        .neq('status', 'cancelled')
        .eq('is_blocked', false);

      if (regErr) throw regErr;

      // Count blocked rows (also exclude cancelled just in case)
      const { data: blocked, error: blkErr } = await supabase
        .from('bookings')
        .select('id')
        .eq('date', date)
        .neq('status', 'cancelled')
        .eq('is_blocked', true);

      if (blkErr) throw blkErr;

      const regularCount = regular?.length || 0;
      const blockedCount = blocked?.length || 0;

      if (mode === 'public') {
        // Public can only book if there are zero regular and zero blocked entries
        return regularCount === 0 && blockedCount === 0;
      }

      // Admin can book a second slot: allow when total < 2
      return (regularCount + blockedCount) < 2;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred while checking availability';
      setError(message);
      throw err;
    }
  };

  /**
   * Checks if a customer already exists in the database
   * @param {string} email - Customer email to check
   * @returns {Promise<boolean>} True if customer exists
   */
  const checkCustomerExists = async (email: string): Promise<boolean> => {
    try {
      const normalized = email.toLowerCase().trim();
      if (!validEmail(normalized)) return false;
      const { data, error: lookupError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', normalized)
        .maybeSingle();

      if (lookupError) throw lookupError;
      
      return !!data; // Returns true if customer exists, false otherwise
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred while checking customer';
      setError(message);
      return false; // Assume customer doesn't exist if there's an error
    }
  };

  /**
   * Creates a new booking and customer record if needed
   * Automatically handles existing vs new customers
   * 
   * @param {Booking} booking - Booking data including customer information
   * @returns {Promise<Object>} Created booking with isExistingCustomer flag
   * @throws {Error} If booking creation fails
   */
  const createBooking = async (booking: CreateBookingPayload) => {
    try {
      setIsLoading(true);
      setError(null);

      // Defensive validation and normalization before any DB operation
      const normalizedEmail = booking.email.toLowerCase().trim();
      const normalizedBillingEmail = booking.billing_email.toLowerCase().trim();
      if (!validEmail(normalizedEmail) || !validEmail(normalizedBillingEmail)) {
        throw new Error('Please enter valid email addresses (e.g., name@example.com).');
      }

      // Check if customer exists
      const isExistingCustomer = await checkCustomerExists(normalizedEmail);

      // Check if customer exists or create new one
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id,email')
        .eq('email', normalizedEmail)
        .maybeSingle();

      let customerId;

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        // Create new customer
        const { data: newCustomer, error: insertError } = await supabase
          .from('customers')
          .insert({
            first_name: booking.first_name,
            last_name: booking.last_name,
            company: booking.company,
            phone: booking.phone.trim(),
            email: normalizedEmail,
            billing_email: normalizedBillingEmail,
            billing_address_line1: booking.billing_address_line1,
            billing_address_line2: booking.billing_address_line2,
            billing_city: booking.billing_city,
            billing_province: booking.billing_province,
            billing_postal_code: formatPostalCode(booking.billing_postal_code || ''),
            billing_instructions: booking.billing_instructions,
            // ensure NOT NULL satisfied (defaults to 'Canada' in DB; set explicitly for clarity)
            billing_country: 'Canada',
          })
          .select()
          .single();

        if (insertError) {
          // Handle race or existing email unique violation by selecting existing
          // Postgres unique_violation code: 23505
          if ((insertError as any).code === '23505') {
            const { data: dupeCustomer, error: dupeErr } = await supabase
              .from('customers')
              .select('id')
              .eq('email', normalizedEmail)
              .maybeSingle();
            if (dupeErr || !dupeCustomer) throw insertError;
            customerId = dupeCustomer.id;
          } else {
            throw insertError;
          }
        } else {
          customerId = newCustomer.id;
        }
      }
      
      // Prepare booking data with fallback for time fields
      const bookingData: any = {
        service: normalizeService(booking.service),
        project_details: booking.project_details,
        bc1_call_number: booking.bc1_call_number,
        date: booking.date,
        site_contact_first_name: booking.site_contact_first_name,
        site_contact_last_name: booking.site_contact_last_name,
        site_contact_phone: booking.site_contact_phone,
        site_contact_email: booking.site_contact_email || null,
        site_address_line1: booking.site_address_line1,
        site_address_line2: booking.site_address_line2,
        site_city: booking.site_city,
        site_province: booking.site_province,
        site_postal_code: formatPostalCode(booking.site_postal_code || ''),
        // ensure NOT NULL satisfied (defaults to 'Canada' in DB; set explicitly for clarity)
        site_country: 'Canada',
        notes: booking.notes,
        payment_method: booking.payment_method,
        purchase_order: booking.purchase_order,
        customer_id: customerId,
        customer_email: normalizedEmail,
        customer_phone: booking.phone.trim(),
        is_blocked: !!booking.is_blocked
      };

      // Add time field if provided
      if (booking.booking_time) {
        bookingData.booking_time = booking.booking_time;
      }

      // Create the booking entry
      const { data, error: bookingError } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (bookingError) {
        throw bookingError;
      }
      
      return { ...data, isExistingCustomer };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred while creating the booking';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBooking,
    checkDateAvailability,
    checkCustomerExists,
    isLoading,
    error
  };
}

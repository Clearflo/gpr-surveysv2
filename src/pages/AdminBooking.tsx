import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { useBookings } from '../hooks/useBookings';
import BookingCalendar from '../components/BookingCalendar';
import { supabase } from '../lib/supabase';
import { sendWebhook } from '../lib/webhook';
import type { Database } from '../types/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];

interface FormData {
  duration: string;
  date: string;
  admin_code: string;
  is_blocked: boolean;
}

const AdminBooking = () => {
  const initialFormData: FormData = {
    duration: 'over-4',
    date: '',
    admin_code: '',
    is_blocked: true
  };

  // BookingCalendar expects a booking-based unblock handler; wrap to delete by date
  const handleUnblockBooking = async (booking: Booking) => {
    await handleUnblock(booking.date);
  };

  // Handle edit from the weekly calendar component (partial updates)
  const handleEditBooking = async (
    booking: Booking,
    updates: Partial<Booking>,
    fileUrls?: string[]
  ) => {
    try {
      // Compute changed fields diff
      const changedFields: string[] = [];
      type BookingKeys = keyof Booking;
      const oldValues: Partial<Record<BookingKeys, unknown>> = {};
      const newValues: Partial<Record<BookingKeys, unknown>> = {};
      for (const [key, value] of Object.entries(updates) as [BookingKeys, Booking[BookingKeys]][]) {
        const prev = booking[key];
        if (prev !== value) {
          changedFields.push(key as string);
          oldValues[key] = prev ?? null;
          newValues[key] = value ?? null;
        }
      }

      if (changedFields.length === 0) {
        setActionFeedback({ type: 'success', message: 'No changes to save' });
        return true;
      }

      const { error } = await supabase
        .from('bookings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', booking.id);

      if (error) {
        console.error('Error updating booking:', error);
        setActionFeedback({ type: 'error', message: `Failed to update booking: ${error.message}` });
        throw new Error(error.message);
      }

      // Fire modified/rescheduled webhook with diff + optional file URLs and full snapshots
      try {
        const originalSnapshot = { ...booking };
        const updatedSnapshot = { ...booking, ...updates } as Booking;

        // Helpers to match creation webhook formatting
        const formatDateSlash = (isoDate?: string) => (isoDate || '').replace(/-/g, '/');
        const formatTimeDisplay = (time?: string) => {
          if (!time) return '';
          // if already looks like 12h with AM/PM, just return
          if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(time)) return time.toUpperCase();
          // assume HH:MM 24h
          const [hh, mm] = time.split(':');
          const h = parseInt(hh || '0', 10);
          const ampm = h >= 12 ? 'PM' : 'AM';
          const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
          return `${displayHour}:${mm} ${ampm}`;
        };
        // (removed to24h helper; we now send DB value for bookingTime and include formatted display)

        // Build payload mirroring "cancelled/created" format with current (updated) values
        const us: any = updatedSnapshot as any;
        const payload = {
          bookingId: us.id,
          jobNumber: us.job_number,

          // Customer Info
          firstName: us.first_name,
          lastName: us.last_name,
          company: us.company,
          // Ensure email is always populated like in cancellation payload
          email: us.email || us.customer_email,
          phone: us.phone,

          // Billing Info
          billingEmail: us.billing_email,
          billingAddressLine1: us.billing_address_line1,
          billingAddressLine2: us.billing_address_line2,
          billingCity: us.billing_city,
          billingProvince: us.billing_province,
          billingPostalCode: us.billing_postal_code,
          billingInstructions: us.billing_instructions,

          // Service Details
          service: us.service,
          projectDetails: us.project_details,
          bc1CallNumber: us.bc1_call_number,
          date: formatDateSlash(us.date),
          // Match cancellation payload: raw DB value for bookingTime, plus formatted
          bookingTime: us.booking_time as string | undefined,
          bookingTimeFormatted: formatTimeDisplay(us.booking_time as string | undefined),

          // Site Contact
          siteContactFirstName: us.site_contact_first_name,
          siteContactLastName: us.site_contact_last_name,
          siteContactPhone: us.site_contact_phone,
          siteContactEmail: us.site_contact_email,

          // Site Location
          siteAddressLine1: us.site_address_line1,
          siteAddressLine2: us.site_address_line2,
          siteCity: us.site_city,
          siteProvince: us.site_province,
          sitePostalCode: us.site_postal_code,

          // Additional Info
          notes: us.notes,
          paymentMethod: us.payment_method,
          purchaseOrder: us.purchase_order,

          // Files (match key naming used in created/cancelled)
          siteFiles: (fileUrls && fileUrls.length
            ? fileUrls
            : (Array.isArray(us.site_plans) ? us.site_plans : [])) as string[],
          fileCount: (fileUrls && fileUrls.length
            ? fileUrls.length
            : (Array.isArray(us.site_plans) ? us.site_plans.length : 0)),
          filesUploaded: !!(fileUrls && fileUrls.length) || !!(Array.isArray(us.site_plans) && us.site_plans.length > 0),

          // Flags
          isBlockedBooking: !!us.is_blocked,

          // Change metadata
          changedFields,
          oldValues,
          newValues,
          original: originalSnapshot,
          updated: updatedSnapshot,
        } as const;

        // Determine event: if date or time changed, treat as 'rescheduled' else 'modified'
        const event = changedFields.some(f => f === 'date' || f === 'booking_time') ? 'rescheduled' : 'modified';
        await sendWebhook(event as any, payload);
      } catch (webhookError) {
        console.error('Error sending modified notification:', webhookError);
        // continue even if webhook fails
      }

      setActionFeedback({ type: 'success', message: 'Booking updated' });
      return true;
    } catch (err) {
      console.error('Error in handleEditBooking:', err);
      throw err;
    }
  };

  // Monthly selection removed; weekly-only

  const handleBulkBlock = async () => {
    if (!isAuthenticated) {
      setError('Admin authentication required');
      return;
    }
    if (selectedDates.length === 0) return;
    setIsSubmitting(true);
    setProcessingStep('Blocking selected dates...');
    try {
      for (const date of selectedDates) {
        const created = await createBooking({
          ...formData,
          date,
          is_blocked: true,
          service: 'Underground Utility Detection',
          site_contact_first_name: 'Admin',
          site_contact_last_name: 'Block',
          site_contact_phone: 'N/A',
          site_contact_email: 'admin@gprsurveys.ca',
          site_address_line1: 'Blocked',
          site_city: 'Victoria',
          site_province: 'BC',
          site_postal_code: 'V8T4N4',
          payment_method: 'credit-card',
          first_name: 'Admin',
          last_name: 'Block',
          email: 'admin@gprsurveys.ca',
          phone: 'N/A',
          billing_email: 'admin@gprsurveys.ca',
          billing_address_line1: 'Blocked',
          billing_city: 'Victoria',
          billing_province: 'BC',
          billing_postal_code: 'V8T4N4'
        });
        try {
          await sendWebhook('blocked', {
            // keep legacy keys from other flows
            bookingId: created.id,
            jobNumber: created.job_number,
            isBlockedBooking: true,
            duration: formData.duration || 'over-4',
            date: date.replace(/-/g, '/'),
            adminCode: formData.admin_code,
            service: 'Administrative Block',
          });
        } catch (e) {
          console.error('Webhook failed for', date, e);
        }
      }
      setActionFeedback({ type: 'success', message: `Blocked ${selectedDates.length} date(s)` });
      setSelectedDates([]);
    } catch (err) {
      console.error(err);
      setActionFeedback({ type: 'error', message: 'Failed to block some dates' });
    } finally {
      setIsSubmitting(false);
      setProcessingStep('');
    }
  };

  // Unblock handler: delete block rows for a given date (immediately frees the date)
  const handleUnblock = async (date: string) => {
    if (!isAuthenticated) {
      setError('Admin authentication required');
      return false;
    }
    try {
      const { error: delError } = await supabase
        .from('bookings')
        .delete()
        .eq('date', date)
        .eq('is_blocked', true)
        .neq('status', 'cancelled');

      if (delError) {
        console.error('Error unblocking date:', delError);
        setActionFeedback({ type: 'error', message: `Failed to unblock ${date}` });
        return false;
      }

      try {
        await sendWebhook('unblocked', {
          date: date.replace(/-/g, '/'),
          service: 'Administrative Block',
        });
      } catch (webhookError) {
        console.error('Error sending unblocked notification:', webhookError);
      }

      setActionFeedback({ type: 'success', message: `Unblocked ${date}` });
      return true;
    } catch (e) {
      console.error('Unexpected error unblocking:', e);
      setActionFeedback({ type: 'error', message: 'Unexpected error while unblocking' });
      return false;
    }
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [adminBlockMode, setAdminBlockMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  const { createBooking } = useBookings();

  const onToggleDateSelect = (dateStr: string) => {
    // Prevent past dates from being selected
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateStr);
    if (d < today) return;

    setSelectedDates(prev => prev.includes(dateStr)
      ? prev.filter(d => d !== dateStr)
      : [...prev, dateStr]
    );
  };

  // Clear feedback message after 5 seconds
  useEffect(() => {
    if (actionFeedback) {
      const timer = setTimeout(() => {
        setActionFeedback(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [actionFeedback]);

  // View is always monthly

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.admin_code === 'GPR2025BLOCK') {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Invalid admin code');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't proceed if already submitting
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    setProcessingStep('');

    try {
      // Validate required fields
      if (!formData.admin_code || !formData.date || !formData.duration) {
        throw new Error('Please fill in all required fields');
      }

      // Format date as YYYY/MM/DD for webhook
      const formattedDate = formData.date.replace(/-/g, '/');

      // First step: Send to webhook
      setProcessingStep('Sending notification...');
      
      const webhookData = {
        isBlockedBooking: true,
        duration: formData.duration,
        date: formattedDate,
        adminCode: formData.admin_code,
        service: 'Administrative Block',
        // action handled by sendWebhook
      };
      // we'll send webhook after creating the booking to include job_number

      // Second step: Create the booking in Supabase
      setProcessingStep('Updating calendar...');
      
      const created = await createBooking({
        ...formData,
        // Add required fields for a valid booking entry
        service: 'Underground Utility Detection',
        site_contact_first_name: 'Admin',
        site_contact_last_name: 'Block',
        site_contact_phone: 'N/A',
        site_contact_email: 'admin@gprsurveys.ca', // Add valid email format to prevent validation errors
        site_address_line1: 'Blocked',
        site_city: 'Victoria',
        site_province: 'BC',
        site_postal_code: 'V8T4N4',
        payment_method: 'credit-card',
        // Add required customer fields with valid email
        first_name: 'Admin',
        last_name: 'Block',
        email: 'admin@gprsurveys.ca',
        phone: 'N/A',
        billing_email: 'admin@gprsurveys.ca',
        billing_address_line1: 'Blocked',
        billing_city: 'Victoria',
        billing_province: 'BC',
        billing_postal_code: 'V8T4N4'
      });
      await sendWebhook('blocked', {
        ...webhookData,
        bookingId: created.id,
        jobNumber: created.job_number,
      });
      
      // Both operations completed successfully
      setSuccess(true);
      setActionFeedback({
        type: 'success',
        message: 'Date has been successfully blocked'
      });
      setFormData(initialFormData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while blocking the date');
      setActionFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to block date'
      });
    } finally {
      setIsSubmitting(false);
      setProcessingStep('');
    }
  };

  // Weekly handlers removed along with weekly view
  
  // Reschedule flow removed; use Modify Booking (edit) instead

  // No monthly/weekly toggle in admin view

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Lock className="w-6 h-6 text-blue-900 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
            </div>
          {/* Global feedback banner for actions (block/unblock/modify/cancel) */}
          {actionFeedback && (
            <div
              className={`mb-4 p-3 border rounded-lg text-sm flex items-start justify-between gap-3 ${
                actionFeedback.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
              role="status"
              aria-live="polite"
            >
              <div>{actionFeedback.message}</div>
              <button
                type="button"
                onClick={() => setActionFeedback(null)}
                className="text-xs opacity-70 hover:opacity-100"
                aria-label="Dismiss notification"
              >
                Dismiss
              </button>
            </div>
          )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleAdminAuth}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Code
                  </label>
                  <input
                    type="password"
                    value={formData.admin_code}
                    onChange={(e) => setFormData({ ...formData, admin_code: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                >
                  Access Admin Panel
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Lock className="w-6 h-6 text-blue-900 mr-2" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Admin Calendar Management</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
          {/* Global feedback banner for actions (block/unblock/modify/cancel) */}
          {actionFeedback && (
            <div
              className={`mb-4 p-3 border rounded-lg text-sm flex items-start justify-between gap-3 ${
                actionFeedback.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
              role="status"
              aria-live="polite"
            >
              <div>{actionFeedback.message}</div>
              <button
                type="button"
                onClick={() => setActionFeedback(null)}
                className="text-xs opacity-70 hover:opacity-100"
                aria-label="Dismiss notification"
              >
                Dismiss
              </button>
            </div>
          )}
          
          {success ? (
            <div className="text-center">
              <div className="mb-4 text-green-600">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Date Successfully Blocked</h2>
              <p className="text-gray-600 mb-8">
                The notification has been sent and the selected date has been blocked in the calendar.
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  setFormData(initialFormData);
                }}
                className="btn-primary"
              >
                Block Another Date
              </button>
            </div>
          ) : (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Admin Calendar Management</h3>
                <p className="text-sm text-yellow-700 mb-2">
                  Tap on any booking to view details, modify, or cancel.
                </p>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                  <li>Tap on any booking to view details, modify, or cancel.</li>
                  <li>View booking details</li>
                  <li>Modify any booking fields including date/time</li>
                  <li>Cancel bookings</li>
                  <li>Block off dates</li>
                </ul>
              </div>

              {/* Monthly calendar only */}
              <div className="mb-6">
                <BookingCalendar
                  selectedDate={selectedDate}
                  onDateSelect={(d) => setSelectedDate(d)}
                  isAdmin={true}
                  selectedTime=""
                  onTimeSelect={() => {}}
                  adminBlockMode={adminBlockMode}
                  selectedDates={selectedDates}
                  onToggleDateSelect={onToggleDateSelect}
                  onUnblock={handleUnblockBooking}
                  onEdit={async (booking, updates, fileUrls) => {
                    await handleEditBooking(booking, updates, fileUrls);
                  }}
                />
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Block Dates</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Block Mode</span>
                    <button
                      type="button"
                      onClick={() => setAdminBlockMode(v => !v)}
                      className={`px-3 py-1 rounded border ${adminBlockMode ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-gray-700 border-gray-300'}`}
                    >
                      {adminBlockMode ? 'On' : 'Off'}
                    </button>
                  </div>
                </div>

                {!adminBlockMode ? (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, duration: 'under-4' })}
                        className={`p-4 border-2 rounded-lg text-left transition-colors duration-200 ${
                          formData.duration === 'under-4'
                            ? 'border-blue-900 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <div className="font-semibold mb-1">Half Day</div>
                        <div className="text-sm text-gray-600">Under 4 hours</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, duration: 'over-4' })}
                        className={`p-4 border-2 rounded-lg text-left transition-colors duration-200 ${
                          formData.duration === 'over-4'
                            ? 'border-blue-900 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <div className="font-semibold mb-1">Full Day</div>
                        <div className="text-sm text-gray-600">Over 4 hours</div>
                      </button>
                    </div>

                      <button
                        onClick={handleSubmit}
                        disabled={!formData.date || !formData.duration || isSubmitting}
                        className={`btn-primary w-full ${
                          !formData.date || !formData.duration || isSubmitting
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
                            {processingStep || 'Processing...'}
                          </>
                        ) : (
                          <>
                            Block Date
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="mb-4 text-sm text-gray-700">Selected: <strong>{selectedDates.length}</strong> date(s)</div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, duration: 'under-4' })}
                          className={`p-4 border-2 rounded-lg text-left transition-colors duration-200 ${
                            formData.duration === 'under-4'
                              ? 'border-blue-900 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-200'
                          }`}
                        >
                          <div className="font-semibold mb-1">Half Day</div>
                          <div className="text-sm text-gray-600">Under 4 hours</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, duration: 'over-4' })}
                          className={`p-4 border-2 rounded-lg text-left transition-colors duration-200 ${
                            formData.duration === 'over-4'
                              ? 'border-blue-900 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-200'
                          }`}
                        >
                          <div className="font-semibold mb-1">Full Day</div>
                          <div className="text-sm text-gray-600">Over 4 hours</div>
                        </button>
                      </div>
                      <button
                        onClick={handleBulkBlock}
                        disabled={selectedDates.length === 0 || !formData.duration || isSubmitting}
                        className={`btn-primary w-full ${
                          selectedDates.length === 0 || !formData.duration || isSubmitting
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        {isSubmitting ? 'Blocking...' : `Block ${selectedDates.length} Date(s)`}
                      </button>
                    </>
                  )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
);
};

export default AdminBooking;
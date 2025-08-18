import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sendWebhook } from '../lib/webhook';
import { 
  CalendarHeader, 
  CalendarGrid, 
  TimeSlotPicker, 
  useCalendar,
  formatDateForQuery 
} from './booking-calendar';
import BookingDetailsModal from './BookingDetailsModal';
import type { Database } from '../types/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];

interface BookingCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  isAdmin?: boolean;
  selectedTime?: string;
  onTimeSelect?: (time: string) => void;
  // Admin block mode: enable multi-select of dates
  adminBlockMode?: boolean;
  selectedDates?: string[];
  onToggleDateSelect?: (date: string) => void;
  onUnblock?: (booking: Booking) => Promise<void>;
  onEdit?: (booking: Booking, updates: Partial<Booking>, fileUrls?: string[]) => Promise<boolean> | Promise<void>;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  selectedDate,
  onDateSelect,
  isAdmin = false,
  selectedTime = '',
  onTimeSelect,
  adminBlockMode = false,
  selectedDates = [],
  onToggleDateSelect,
  onUnblock,
  onEdit
}) => {
  const {
    currentMonth,
    isLoading,
    error,
    bookedDates,
    dateBookingsMap,
    selectedDateBookings,
    showBookingModal,
    showTimePicker,
    calendarRef,
    setSelectedDateBookings,
    setShowBookingModal,
    fetchMonthBookings,
    hasBookings,
    getBookingsForDate,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth
  } = useCalendar(selectedDate, isAdmin);
  
  // Handle date click
  const handleDateClick = (date: Date) => {
    const dateStr = formatDateForQuery(date);

    // In admin block mode, toggle selection
    if (isAdmin && adminBlockMode) {
      if (onToggleDateSelect) onToggleDateSelect(dateStr);
      return;
    }

    // For admin, show bookings if the date has any
    if (isAdmin && hasBookings(date)) {
      const dateBookings = getBookingsForDate(date);
      setSelectedDateBookings(dateBookings);
      setShowBookingModal(true);
      return;
    }
    
    // For non-admin users, only allow booking available dates
    if (!isAdmin) {
      onDateSelect(dateStr);
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (booking: Booking, reason: string): Promise<void> => {
    try {
      console.log(`Attempting to cancel booking ${booking.id} with reason: ${reason}`);
      
      const { data, error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancelled_by: 'admin',
          cancellation_reason: reason
        })
        .eq('id', booking.id)
        .select();

      if (error) {
        console.error('Error cancelling booking:', error);
        throw new Error('Failed to cancel booking: ' + error.message);
      }

      console.log('Booking cancelled successfully:', data);
      
      // Send detailed cancellation webhook (mirror created/modified payload shape)
      try {
        const b: any = booking as any;
        const formatDateSlash = (isoDate?: string) => (isoDate || '').replace(/-/g, '/');
        const formatTimeDisplay = (time?: string) => {
          if (!time) return '';
          if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(time)) return time.toUpperCase();
          const [hh, mm] = time.split(':');
          const h = parseInt(hh || '0', 10);
          const ampm = h >= 12 ? 'PM' : 'AM';
          const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
          return `${displayHour}:${mm} ${ampm}`;
        };

        const siteFiles: string[] = Array.isArray(b.site_plans) ? b.site_plans : [];

        const payload = {
          // IDs
          bookingId: booking.id,
          jobNumber: b.job_number,

          // Customer Info
          firstName: b.first_name,
          lastName: b.last_name,
          company: b.company,
          email: b.email || b.customer_email,
          phone: b.phone,

          // Billing Info
          billingEmail: b.billing_email,
          billingAddressLine1: b.billing_address_line1,
          billingAddressLine2: b.billing_address_line2,
          billingCity: b.billing_city,
          billingProvince: b.billing_province,
          billingPostalCode: b.billing_postal_code,
          billingInstructions: b.billing_instructions,

          // Service Details
          service: booking.service,
          projectDetails: b.project_details,
          bc1CallNumber: b.bc1_call_number,
          date: formatDateSlash(booking.date),
          bookingTime: b.booking_time,
          bookingTimeFormatted: formatTimeDisplay(b.booking_time),

          // Site Contact
          siteContactFirstName: b.site_contact_first_name,
          siteContactLastName: b.site_contact_last_name,
          siteContactPhone: b.site_contact_phone,
          siteContactEmail: b.site_contact_email,

          // Site Location
          siteAddressLine1: b.site_address_line1,
          siteAddressLine2: b.site_address_line2,
          siteCity: b.site_city,
          siteProvince: b.site_province,
          sitePostalCode: b.site_postal_code,

          // Additional Info
          notes: b.notes,
          paymentMethod: b.payment_method,
          purchaseOrder: b.purchase_order,

          // Files
          siteFiles: siteFiles,
          fileCount: siteFiles.length,
          filesUploaded: siteFiles.length > 0,

          // Flags
          isBlockedBooking: !!b.is_blocked,

          // Cancellation meta
          cancelledBy: 'admin',
          cancellationReason: reason,
          cancelledAt: new Date().toISOString(),

          // Snapshot
          original: { ...booking }
        } as const;

        await sendWebhook('cancelled', payload);
      } catch (webhookError) {
        console.error('Error sending cancellation notification:', webhookError);
      }

      await fetchMonthBookings();
    } catch (err) {
      console.error('Error in handleCancelBooking:', err);
      throw err;
    }
  };

  // Unified modify flow (edit) handled by parent via onEdit
  const handleEdit = async (booking: Booking, updates: Partial<Booking>, fileUrls?: string[]) => {
    if (!onEdit) return;
    await onEdit(booking, updates, fileUrls);
    await fetchMonthBookings();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg" ref={calendarRef}>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}
      
      <CalendarHeader
        currentMonth={currentMonth}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        onGoToCurrentMonth={goToCurrentMonth}
      />
      
      <CalendarGrid
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        bookedDates={bookedDates}
        dateBookingsMap={dateBookingsMap}
        isAdmin={isAdmin}
        isLoading={isLoading}
        onDateClick={handleDateClick}
        adminBlockMode={adminBlockMode}
        selectedDates={selectedDates}
        onToggleDateSelect={(date) => {
          const dateStr = formatDateForQuery(date);
          if (onToggleDateSelect) onToggleDateSelect(dateStr);
        }}
      />
      
      {/* Time picker for non-admin users */}
      {showTimePicker && selectedDate && !isAdmin && onTimeSelect && (
        <TimeSlotPicker
          selectedTime={selectedTime}
          onTimeSelect={onTimeSelect}
          dateHasBooking={bookedDates.includes(selectedDate)}
        />
      )}
      
      {/* Legend */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-900 rounded-full mr-1"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-100 rounded-full mr-1"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-100 rounded-full mr-1"></div>
            <span>Weekend/Past</span>
          </div>
          {isAdmin && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-100 rounded-full mr-1"></div>
              <span>Has Booking</span>
            </div>
          )}
        </div>
        
        {isAdmin && (
          <div className="mt-2 text-xs text-center text-gray-500">
            <Info className="w-3 h-3 inline-block mr-1" />
            Click on dates with bookings to view, modify, or cancel them
          </div>
        )}
        
        {!isAdmin && (
          <div className="mt-2 text-xs text-center text-gray-500">
            <Info className="w-3 h-3 inline-block mr-1" />
            One booking per day • 24-hour availability • Weekends unavailable
          </div>
        )}
      </div>
      
      {/* Booking details modal */}
      {showBookingModal && (
        <BookingDetailsModal
          bookings={selectedDateBookings}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedDateBookings([]);
          }}
          onCancel={handleCancelBooking}
          onEdit={handleEdit}
          onUnblock={onUnblock}
        />
      )}
    </div>
  );
};

export default BookingCalendar;

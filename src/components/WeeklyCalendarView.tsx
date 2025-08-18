import React, { useState, useRef } from 'react';
import { CalendarIcon, Check } from 'lucide-react';
import { useWeeklyCalendar } from '../hooks/useWeeklyCalendar';
import { 
  WeekHeader, 
  DayColumn, 
  BookingDetailsModal, 
  BlockDateModal,
  getWeekDays,
  isWeekend,
  isPastDate,
  formatDateForQuery
} from './calendar/weekly';
import type { Database } from '../types/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];

interface WeeklyCalendarProps {
  onSelectBooking: (booking: Booking) => void;
  actionFeedback: { message: string; type: 'success' | 'error' } | null;
  onCancelBooking: (booking: Booking, reason: string) => Promise<boolean>;
  onEditBooking?: (booking: Booking, updates: Partial<Booking>, fileUrls?: string[]) => Promise<boolean>;
  onFeedback?: (message: string, type: 'success' | 'error') => void;
  // Admin multi-select block mode (lifted state from AdminBooking)
  adminBlockMode?: boolean;
  selectedDates?: string[];
  onToggleDateSelect?: (dateStr: string) => void;
  onClearSelection?: () => void;
  onBlockSelected?: () => Promise<void> | void;
  duration?: 'under-4' | 'over-4';
  onSetDuration?: (d: 'under-4' | 'over-4') => void;
  onUnblock?: (date: string) => Promise<boolean>;
}

const WeeklyCalendarView: React.FC<WeeklyCalendarProps> = ({
  onSelectBooking,
  actionFeedback,
  onCancelBooking,
  onEditBooking,
  onFeedback,
  adminBlockMode = false,
  selectedDates = [],
  onToggleDateSelect,
  onClearSelection,
  onBlockSelected,
  duration = 'over-4',
  onSetDuration,
  onUnblock
}) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dateToBlock, setDateToBlock] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const {
    currentWeekStart,
    currentWeekEnd,
    isLoading,
    error,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    getBookingsForDate,
    blockDate,
    refreshBookings
  } = useWeeklyCalendar();

  // Handle cancel booking
  const handleDeleteBooking = async (reason: string) => {
    if (!selectedBooking) return;

    try {
      const success = await onCancelBooking(selectedBooking, reason);
      if (success) {
        await refreshBookings();
      }
    } catch (err) {
      console.error('Error in handleDeleteBooking:', err);
      throw err;
    }
  };

  // Handle edit booking
  const handleEdit = async (updates: Partial<Booking>, fileUrls?: string[]) => {
    if (!selectedBooking || !onEditBooking) return;
    try {
      const success = await onEditBooking(selectedBooking, updates, fileUrls);
      if (success) {
        await refreshBookings();
      }
    } catch (err) {
      console.error('Error in handleEdit:', err);
      throw err;
    }
  };

  // Unified modify flow covers date/time edits via onEdit

  // Handle blocking a date
  const handleBlockDate = async (duration: 'under-4' | 'over-4') => {
    if (!dateToBlock) return;
    try {
      await blockDate(dateToBlock, duration);
      onFeedback?.(
        `Blocked ${dateToBlock.toISOString().slice(0,10).replace(/-/g,'/')}${duration === 'under-4' ? ' (Half Day)' : ' (Full Day)'}`,
        'success'
      );
    } catch (e) {
      console.error('Failed to block date from weekly view:', e);
      onFeedback?.('Failed to block date. Please try again.', 'error');
    } finally {
      setDateToBlock(null);
    }
  };

  // Handle clicking on a date
  const handleDateClick = (date: Date) => {
    const isPast = isPastDate(date);
    const isWeekendDate = isWeekend(date);
    
    if (adminBlockMode) {
      if (!isPast && onToggleDateSelect) {
        onToggleDateSelect(formatDateForQuery(date));
      }
      return;
    }
    if (!isPast && !isWeekendDate) {
      setDateToBlock(date);
    }
  };

  // Render the vertical weekly view
  const renderVerticalWeeklyView = () => {
    const weekDays = getWeekDays(currentWeekStart);
    
    return (
      <div className="space-y-2">
        {weekDays.map((date, index) => (
          <DayColumn
            key={index}
            date={date}
            bookings={getBookingsForDate(date)}
            onDateClick={handleDateClick}
            onBookingClick={(b) => { setSelectedBooking(b); onSelectBooking(b); }}
            adminBlockMode={adminBlockMode}
            isSelected={selectedDates.includes(formatDateForQuery(date))}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg" ref={calendarRef}>
      {/* Feedback message */}
      {actionFeedback && (
        <div className={`mb-4 p-3 border rounded-lg text-sm ${
          actionFeedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {actionFeedback.message}
        </div>
      )}

      {/* Calendar header with navigation */}
      <WeekHeader
        currentWeekStart={currentWeekStart}
        currentWeekEnd={currentWeekEnd}
        onPreviousWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
        onGoToCurrentWeek={goToCurrentWeek}
      />

      {/* Weekly calendar view with swipe support */}
      <div 
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          </div>
        ) : error ? (
          <div className="h-60 flex items-center justify-center">
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">
              Failed to load bookings: {error}
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[60vh] pr-1">
            {renderVerticalWeeklyView()}
          </div>
        )}
      </div>

      {/* Instructions for mobile use */}
      <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-600">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <CalendarIcon className="w-3 h-3 mr-1 text-blue-600" />
            <span className="font-medium">Weekly View</span>
          </div>
          <div className="text-xxs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            Mobile Optimized
          </div>
        </div>
        <ul className="space-y-1 list-inside text-xxs">
          <li className="flex items-start">
            <Check className="w-3 h-3 text-green-600 mr-1 mt-0.5 flex-shrink-0" />
            <span>Swipe left/right to navigate weeks</span>
          </li>
          <li className="flex items-start">
            <Check className="w-3 h-3 text-green-600 mr-1 mt-0.5 flex-shrink-0" />
            <span>Tap on any booking to view details</span>
          </li>
          <li className="flex items-start">
            <Check className="w-3 h-3 text-green-600 mr-1 mt-0.5 flex-shrink-0" />
            <span>Cancel or modify bookings directly from details</span>
          </li>
        </ul>
      </div>

      {/* Booking details modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onDelete={handleDeleteBooking}
          onEdit={handleEdit}
          onUnblock={async (dateStr) => {
            if (!onUnblock) return false;
            const ok = await onUnblock(dateStr);
            if (ok) {
              await refreshBookings();
            }
            return ok;
          }}
        />
      )}

      {/* Block Date Modal */}
      {dateToBlock && (
        <BlockDateModal
          date={dateToBlock}
          onClose={() => setDateToBlock(null)}
          onBlock={handleBlockDate}
        />
      )}

      {/* Sticky Admin Action Bar for Multi-select */}
      {adminBlockMode && (
        <div className="sticky bottom-0 left-0 right-0 mt-4 bg-white border-t border-gray-200 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-gray-700">Selected: <strong>{selectedDates.length}</strong> date(s)</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSetDuration?.('under-4')}
                className={`px-2 py-1 text-xxs rounded border ${duration === 'under-4' ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                Half Day
              </button>
              <button
                type="button"
                onClick={() => onSetDuration?.('over-4')}
                className={`px-2 py-1 text-xxs rounded border ${duration === 'over-4' ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                Full Day
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onClearSelection?.()}
                className="px-3 py-1 text-xxs rounded border bg-white text-gray-700 border-gray-300"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={async () => { await onBlockSelected?.(); }}
                className={`px-3 py-1 text-xxs rounded ${selectedDates.length === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800'} text-white`}
                disabled={selectedDates.length === 0}
              >
                Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyCalendarView;

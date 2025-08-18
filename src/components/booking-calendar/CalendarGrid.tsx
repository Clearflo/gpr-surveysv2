import React from 'react';
import DateCell from './DateCell';
import type { Database } from '../../types/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: string;
  bookedDates: string[];
  dateBookingsMap: {[key: string]: Booking[]};
  isAdmin: boolean;
  isLoading: boolean;
  onDateClick: (date: Date) => void;
  // admin block mode multi-select
  adminBlockMode?: boolean;
  selectedDates?: string[];
  onToggleDateSelect?: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  selectedDate,
  bookedDates,
  dateBookingsMap,
  isAdmin,
  isLoading,
  onDateClick,
  adminBlockMode = false,
  selectedDates = [],
  onToggleDateSelect
}) => {
  // Get the first day of the month for the calendar
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  
  // Get the last day of the month
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  
  // Get the day of the week for the first day (0-6, where 0 is Sunday)
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  // Format date as YYYY-MM-DD for comparison
  const formatDateForQuery = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Is the date today?
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  // Is the date in the past?
  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Is the date tomorrow or later?
  const isFutureDate = (date: Date): boolean => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return date >= tomorrow;
  };
  
  // Is the date a weekend?
  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };
  
  // Is the date available for booking?
  const isDateAvailable = (date: Date): boolean => {
    // Admin can see all dates
    if (isAdmin) return true;
    
    // Past dates and weekends are not bookable
    if (isPastDate(date) || isWeekend(date)) {
      return false;
    }
    
    // Same day bookings are not allowed
    if (!isFutureDate(date)) {
      return false;
    }
    
    const dateStr = formatDateForQuery(date);
    
    // Check if date already has a booking
    return !bookedDates.includes(dateStr);
  };
  
  // Check if date has bookings (for admin view)
  const hasBookings = (date: Date): boolean => {
    const dateStr = formatDateForQuery(date);
    return !!dateBookingsMap[dateStr]?.length;
  };
  
  // Generate dates for the calendar grid
  const generateCalendarDays = (): Date[] => {
    const days: Date[] = [];
    
    // Add days from previous month to fill the first week
    const daysFromPreviousMonth = startingDayOfWeek;
    const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    
    for (let i = daysFromPreviousMonth; i > 0; i--) {
      days.push(new Date(previousMonth.getFullYear(), previousMonth.getMonth(), previousMonth.getDate() - i + 1));
    }
    
    // Add days from current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    }
    
    // Add days from next month to fill the last week
    const daysInGrid = Math.ceil((startingDayOfWeek + lastDayOfMonth.getDate()) / 7) * 7;
    const daysFromNextMonth = daysInGrid - days.length;
    
    for (let day = 1; day <= daysFromNextMonth; day++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day));
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div
            key={index}
            className="p-2 text-center text-sm font-medium text-gray-600"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1 select-none">
        {calendarDays.map((date, index) => {
          const dateStr = formatDateForQuery(date);
          const isSelected = adminBlockMode ? selectedDates.includes(dateStr) : (dateStr === selectedDate);
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isCurrentDate = isToday(date);
          const isPast = isPastDate(date);
          const isWeekendDay = isWeekend(date);
          const isSameDay = isCurrentDate && !isFutureDate(date);
          const isAvailable = isDateAvailable(date);
          const isBooked = bookedDates.includes(dateStr);
          const dateHasBookings = hasBookings(date);
          
          return (
            <DateCell
              key={index}
              date={date}
              isSelected={isSelected}
              isCurrentMonth={isCurrentMonth}
              isToday={isCurrentDate}
              isPast={isPast}
              isWeekend={isWeekendDay}
              isSameDay={isSameDay}
              isAvailable={isAvailable}
              isBooked={isBooked}
              hasBookings={dateHasBookings}
              isAdmin={isAdmin}
              onClick={() => onDateClick(date)}
              onDateClick={(d) => {
                if (isAdmin && adminBlockMode && onToggleDateSelect) {
                  onToggleDateSelect(d);
                  return;
                }
                onDateClick(d);
              }}
              adminBlockMode={adminBlockMode}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
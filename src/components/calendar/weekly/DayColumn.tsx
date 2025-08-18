import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { BookingCard } from './BookingCard';
import type { Database } from '../../../types/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];

interface DayColumnProps {
  date: Date;
  bookings: Booking[];
  onDateClick: (date: Date) => void;
  onBookingClick: (booking: Booking) => void;
  adminBlockMode?: boolean;
  isSelected?: boolean;
}

export const DayColumn: React.FC<DayColumnProps> = ({
  date,
  bookings,
  onDateClick,
  onBookingClick,
  adminBlockMode = false,
  isSelected = false
}) => {
  // Is the date today?
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  // Is the date a weekend?
  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
  const isDateToday = isToday(date);
  const isDateWeekend = isWeekend(date);
  const isBlocked = bookings.some(booking => booking.is_blocked);

  return (
    <div 
      className={`rounded-lg overflow-hidden border ${
        isDateToday ? 'border-blue-400 bg-blue-50' : 
        isPastDate ? 'border-gray-200 bg-gray-50' :
        isDateWeekend ? 'border-gray-200 bg-gray-100' : 
        'border-gray-200 bg-white'
      }`}
      onClick={() => {
        // In admin block mode, allow selecting any non-past day (including weekends and days with bookings)
        if (adminBlockMode) {
          if (!isPastDate) onDateClick(date);
          return;
        }
        // Normal behavior: only empty, non-past, non-weekend
        if (bookings.length === 0 && !isPastDate && !isDateWeekend) {
          onDateClick(date);
        }
      }}
    >
      {/* Date header */}
      <div className={`p-2 font-medium flex justify-between items-center ${
        isDateToday ? 'bg-blue-100 text-blue-800' : 
        isPastDate ? 'bg-gray-100 text-gray-700' :
        isDateWeekend ? 'bg-gray-200 text-gray-700' : 
        'bg-gray-50 text-gray-700'
      }`}>
        <div className="flex items-center">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>{formatDate(date)}</span>
        </div>
        {bookings.length > 0 && (
          <span className="bg-blue-900 text-white text-xxs px-2 py-0.5 rounded-full">
            {isBlocked ? 'Blocked' : `${bookings.length} ${bookings.length === 1 ? 'booking' : 'bookings'}`}
          </span>
        )}
      </div>
      
      {/* Bookings list */}
      <div className={`${bookings.length > 0 ? 'p-2' : 'p-0'} ${adminBlockMode ? 'cursor-crosshair' : ''}`}>
        {bookings.length > 0 ? (
          <div className="space-y-2">
            {bookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onBookingClick={onBookingClick}
              />
            ))}
          </div>
        ) : (
          <div 
            className={`py-3 text-center text-xs ${
              isPastDate ? 'text-gray-500' :
              adminBlockMode ? 'text-blue-600 hover:text-blue-800 cursor-pointer' :
              isDateWeekend ? 'text-gray-500' :
              'text-blue-600 hover:text-blue-800 cursor-pointer'
            }`}
          >
            {isPastDate ? 'Past Date' : 
             adminBlockMode ? (isSelected ? 'Selected' : 'Tap to Select') :
             isDateWeekend ? 'Weekend - Not Available' : 
             'Click to Block Date'}
          </div>
        )}
      </div>
      {adminBlockMode && !isPastDate && (
        <div className={`h-1 ${isSelected ? 'bg-blue-900' : 'bg-transparent'}`} />
      )}
    </div>
  );
};

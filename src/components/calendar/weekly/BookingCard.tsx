import React from 'react';
import { MapPin, Lock, Edit } from 'lucide-react';
import type { Database } from '../../../types/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];

interface BookingCardProps {
  booking: Booking;
  onBookingClick: (booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onBookingClick
}) => {
  // Format booking display time based on duration
  const getBookingTime = (booking: Booking): string => {
    return booking.duration === 'over-4' ? 'Full Day' : 'Half Day';
  };

  // Get status badge for a booking
  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      rescheduled: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xxs font-medium ${
        statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div 
      className="bg-white rounded border border-gray-200 shadow-sm p-2 hover:bg-blue-50 transition-colors cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onBookingClick(booking);
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-xs">
            {booking.is_blocked ? (
              <div className="flex items-center text-blue-900">
                <Lock className="w-3 h-3 mr-1" />
                Blocked
              </div>
            ) : (
              `${booking.site_contact_first_name} ${booking.site_contact_last_name}`
            )}
          </div>
          {!booking.is_blocked && (
            <>
              <div className="text-xxs text-gray-600 mt-0.5">
                {booking.customer_email || 'No email'}
              </div>
              <div className="flex items-center mt-1 text-xxs text-gray-600">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="truncate">{booking.site_city}</span>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col items-end">
          {!booking.is_blocked && getStatusBadge(booking.status)}
          <div className="text-xxs mt-1 bg-gray-100 px-1 py-0.5 rounded">
            {getBookingTime(booking)}
          </div>
        </div>
      </div>
      {!booking.is_blocked && (
        <div className="mt-1 flex justify-between items-center">
          <div className="text-xxs bg-blue-50 px-1 py-0.5 rounded truncate max-w-[70%]">
            {booking.service.split(' ').slice(0, 2).join(' ')}...
          </div>
          <div className="flex space-x-1">
            <button 
              className="p-1 bg-blue-100 hover:bg-blue-200 rounded text-blue-800"
              onClick={(e) => {
                e.stopPropagation();
                onBookingClick(booking);
              }}
            >
              <Edit className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

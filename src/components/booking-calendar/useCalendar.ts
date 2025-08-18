import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { formatDateForQuery } from './calendarUtils';
import type { Database } from '../../types/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];

export const useCalendar = (selectedDate: string, isAdmin: boolean) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    if (selectedDate) {
      return new Date(selectedDate);
    }
    return new Date();
  });
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [dateBookingsMap, setDateBookingsMap] = useState<{[key: string]: Booking[]}>({});
  const [selectedDateBookings, setSelectedDateBookings] = useState<Booking[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [bookedTimesForDate, setBookedTimesForDate] = useState<string[]>([]);
  
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Fetch bookings for the current month
  const fetchMonthBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get first and last day of month for query
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .gte('date', formatDateForQuery(firstDay))
        .lte('date', formatDateForQuery(lastDay))
        .neq('status', 'cancelled');
      
      if (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings. Please try again.');
      } else {
        setBookings(data || []);
        
        // Simply mark dates as booked (one booking per day)
        const booked = new Set<string>();
        const bookingsByDate: {[key: string]: Booking[]} = {};
        
        data?.forEach(booking => {
          const dateStr = booking.date;
          booked.add(dateStr);
          
          if (!bookingsByDate[dateStr]) {
            bookingsByDate[dateStr] = [];
          }
          bookingsByDate[dateStr].push(booking);
        });
        
        // Convert Set to array for compatibility with includes() method
        setBookedDates(Array.from(booked));
        setDateBookingsMap(bookingsByDate);
      }
    } catch (err) {
      console.error('Unexpected error in fetchMonthBookings:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = supabase
      .channel('bookings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        async (payload) => {
          console.log('Received real-time update:', payload);
          await fetchMonthBookings();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentMonth]);
  
  // Fetch bookings whenever the month changes
  useEffect(() => {
    fetchMonthBookings();
  }, [currentMonth]);

  // When a date is selected, show time picker if not admin
  useEffect(() => {
    if (selectedDate && !isAdmin) {
      setShowTimePicker(true);
      // Fetch booked times for the selected date
      const booking = dateBookingsMap[selectedDate]?.[0];
      if (booking && (booking as any).booking_time) {
        setBookedTimesForDate([(booking as any).booking_time]);
      } else {
        setBookedTimesForDate([]);
      }
    }
  }, [selectedDate, isAdmin, dateBookingsMap]);
  
  // Check if date has bookings (for admin view)
  const hasBookings = (date: Date): boolean => {
    const dateStr = formatDateForQuery(date);
    return !!dateBookingsMap[dateStr]?.length;
  };
  
  // Get bookings for a specific date
  const getBookingsForDate = (date: Date): Booking[] => {
    const dateStr = formatDateForQuery(date);
    return dateBookingsMap[dateStr] || [];
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Go to current month
  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  return {
    currentMonth,
    bookings,
    isLoading,
    error,
    bookedDates,
    dateBookingsMap,
    selectedDateBookings,
    showBookingModal,
    showTimePicker,
    bookedTimesForDate,
    calendarRef,
    setSelectedDateBookings,
    setShowBookingModal,
    fetchMonthBookings,
    hasBookings,
    getBookingsForDate,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth
  };
};
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { 
  getWeekStart, 
  getWeekEnd, 
  formatDateForQuery,
  getPreviousWeek,
  getNextWeek,
  isSignificantSwipe
} from '../components/calendar/weekly/weeklyCalendarUtils';
import type { Database } from '../types/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];

export const useWeeklyCalendar = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => getWeekStart());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const loadingTimeoutRef = useRef<number | null>(null);
  const mountedRef = useRef<boolean>(false);
  const refetchScheduledRef = useRef<boolean>(false);
  const inFlightRef = useRef<boolean>(false);

  // Calculate the end date of the current week (memoized to avoid identity churn)
  const currentWeekEnd = useMemo(() => getWeekEnd(currentWeekStart), [currentWeekStart]);

  // Fetch bookings for the current week
  const fetchWeekBookings = useCallback(async (showSpinner: boolean = true) => {
    // Start loading for this request (optionally silent for background refreshes)
    if (inFlightRef.current) {
      console.debug('[Weekly] Skipping fetch: request already in-flight');
      return;
    }
    inFlightRef.current = true;
    if (showSpinner) setIsLoading(true);
    try {
      setError(null);
      console.debug('[Weekly] Fetching bookings', {
        start: formatDateForQuery(currentWeekStart),
        end: formatDateForQuery(currentWeekEnd)
      });
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .gte('date', formatDateForQuery(currentWeekStart))
        .lte('date', formatDateForQuery(currentWeekEnd))
        .neq('status', 'cancelled'); // Don't show cancelled bookings

      if (error) {
        console.error('Error fetching weekly bookings:', error);
        setError(error.message ?? 'Failed to load weekly bookings');
      } else {
        setBookings(data || []);
      }
    } catch (err) {
      console.error('Unexpected error in fetchWeekBookings:', err);
      setError(err instanceof Error ? err.message : 'Unexpected error loading bookings');
    } finally {
      setIsLoading(false);
      inFlightRef.current = false;
      console.debug('[Weekly] Fetch completed');
    }
  }, [currentWeekStart]);

  // Subscribe to real-time updates
  useEffect(() => {
    mountedRef.current = true;
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
          console.debug('Weekly view: Received real-time update:', payload?.eventType);
          // Only refresh if the changed row is within current week window
          const changedDate: string | undefined = (payload as any)?.new?.date || (payload as any)?.old?.date;
          if (changedDate) {
            const startStr = formatDateForQuery(currentWeekStart);
            const endStr = formatDateForQuery(currentWeekEnd);
            if (changedDate < startStr || changedDate > endStr) {
              return;
            }
          }
          // Throttle refreshes to avoid loops/spam
          if (refetchScheduledRef.current) return;
          refetchScheduledRef.current = true;
          window.setTimeout(async () => {
            if (!mountedRef.current) return;
            refetchScheduledRef.current = false;
            await fetchWeekBookings(false); // silent refresh without spinner
          }, 500);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      mountedRef.current = false;
    };
  }, [fetchWeekBookings]);

  // Fetch bookings when the week changes
  useEffect(() => {
    // Kick off fetch for current week
    fetchWeekBookings();
  }, [fetchWeekBookings]);

  // Loading timeout safeguard: if still loading after 10s, surface an error rather than spin forever
  useEffect(() => {
    if (!isLoading) {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      return;
    }
    if (loadingTimeoutRef.current) return;
    loadingTimeoutRef.current = window.setTimeout(() => {
      if (mountedRef.current && isLoading) {
        console.warn('[Weekly] Loading timed out after 10s');
        setError(prev => prev ?? 'Loading timed out. Please refresh or try again.');
        setIsLoading(false);
      }
    }, 10000);
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [isLoading]);

  // Navigate to previous week
  const goToPreviousWeek = useCallback(() => {
    setCurrentWeekStart(getPreviousWeek(currentWeekStart));
  }, [currentWeekStart]);

  // Navigate to next week
  const goToNextWeek = useCallback(() => {
    setCurrentWeekStart(getNextWeek(currentWeekStart));
  }, [currentWeekStart]);

  // Go to current week
  const goToCurrentWeek = useCallback(() => {
    setCurrentWeekStart(getWeekStart());
  }, []);

  // Touch handlers for swipe navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    const swipe = isSignificantSwipe(touchStart, touchEnd);
    
    if (swipe.isLeft) {
      goToNextWeek();
    }
    if (swipe.isRight) {
      goToPreviousWeek();
    }
  }, [touchStart, touchEnd, goToNextWeek, goToPreviousWeek]);

  // Get bookings for a specific date
  const getBookingsForDate = useCallback((date: Date): Booking[] => {
    const dateStr = formatDateForQuery(date);
    return bookings.filter(booking => booking.date === dateStr);
  }, [bookings]);

  // Handle blocking a date
  const blockDate = useCallback(async (date: Date, duration: 'under-4' | 'over-4') => {
    try {
      // Create a blocked booking
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          service: 'Underground Utility Detection',
          duration: duration,
          date: formatDateForQuery(date),
          is_blocked: true,
          admin_code: 'GPR2025BLOCK',
          // Required fields for a valid booking
          site_contact_first_name: 'Admin',
          site_contact_last_name: 'Block',
          site_contact_phone: 'N/A',
          site_contact_email: 'admin@gprsurveys.ca',
          site_address_line1: 'Blocked',
          site_city: 'Victoria',
          site_province: 'BC',
          site_postal_code: 'V8T4N4',
          payment_method: 'credit-card',
          status: 'confirmed'
        })
        .select()
        .single();

      if (error) {
        console.error('Error blocking date:', error);
        throw new Error('Failed to block date');
      }

      // Send webhook notification
      try {
        const webhookData = {
          isBlockedBooking: true,
          duration: duration,
          date: formatDateForQuery(date),
          bookingId: data.id,
          service: 'Underground Utility Detection',
          adminBy: 'admin',
          action: 'block'
        };

        await fetch('https://hook.us2.make.com/5fevpkpj51wiujwkkp6kjpd9swv7e96a', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData)
        });
      } catch (webhookError) {
        console.error('Error sending block notification:', webhookError);
        // Continue with process even if notification fails
      }

      // Refresh bookings immediately
      await fetchWeekBookings();
    } catch (err) {
      console.error('Error in blockDate:', err);
      throw err;
    }
  }, [fetchWeekBookings]);

  return {
    currentWeekStart,
    currentWeekEnd,
    bookings,
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
    refreshBookings: fetchWeekBookings
  };
};

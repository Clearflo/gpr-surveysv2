/**
 * Utility functions for weekly calendar operations
 */

/**
 * Format date as YYYY-MM-DD for Supabase query
 */
export const formatDateForQuery = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Check if the date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if the date is a weekend
 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

/**
 * Check if the date is in the past
 */
export const isPastDate = (date: Date): boolean => {
  return date < new Date(new Date().setHours(0, 0, 0, 0));
};

/**
 * Get the start of the current week (Sunday)
 */
export const getWeekStart = (date: Date = new Date()): Date => {
  const dayOfWeek = date.getDay();
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - dayOfWeek);
  startDate.setHours(0, 0, 0, 0);
  return startDate;
};

/**
 * Get the end of the current week (Saturday)
 */
export const getWeekEnd = (startDate: Date): Date => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);
  return endDate;
};

/**
 * Generate array of dates for a week
 */
export const getWeekDays = (weekStart: Date): Date[] => {
  const days: Date[] = [];
  const startDate = new Date(weekStart);

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push(date);
  }

  return days;
};

/**
 * Format date for display with full weekday name
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    weekday: 'short'
  });
};

/**
 * Format date for header display (no weekday)
 */
export const formatHeaderDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric'
  });
};

/**
 * Format a date string (YYYY-MM-DD) to a localized display format
 */
export const formatDisplayDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00'); // Add time to ensure proper date creation
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Get week information text
 */
export const getWeekInfoText = (weekStart: Date): string => {
  const weekNum = Math.ceil((weekStart.getDate() - weekStart.getDay() + 
    (weekStart.getDay() === 0 ? 1 : 0)) / 7) + 1;
  
  const year = weekStart.getFullYear();
  const month = weekStart.toLocaleString('default', { month: 'long' });
  
  return `${month} ${year} - Week ${weekNum}`;
};

/**
 * Navigate to previous week
 */
export const getPreviousWeek = (currentWeekStart: Date): Date => {
  const newWeekStart = new Date(currentWeekStart);
  newWeekStart.setDate(currentWeekStart.getDate() - 7);
  return newWeekStart;
};

/**
 * Navigate to next week
 */
export const getNextWeek = (currentWeekStart: Date): Date => {
  const newWeekStart = new Date(currentWeekStart);
  newWeekStart.setDate(currentWeekStart.getDate() + 7);
  return newWeekStart;
};

/**
 * Check if a swipe gesture is significant enough
 */
export const isSignificantSwipe = (touchStart: number | null, touchEnd: number | null): { isLeft: boolean; isRight: boolean } => {
  if (!touchStart || !touchEnd) return { isLeft: false, isRight: false };
  
  const distance = touchStart - touchEnd;
  const threshold = 75;
  
  return {
    isLeft: distance > threshold,
    isRight: distance < -threshold
  };
};

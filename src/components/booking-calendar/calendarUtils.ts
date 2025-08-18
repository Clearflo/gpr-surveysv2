// Calendar utility functions

export const formatDateForQuery = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatDateForUI = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const isFutureDate = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return date >= tomorrow;
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const isDateAvailable = (
  date: Date,
  isAdmin: boolean,
  bookedDates: Set<string>
): boolean => {
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
  return !bookedDates.has(dateStr);
};

export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 8; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }
  return slots;
};

export const formatTimeDisplay = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

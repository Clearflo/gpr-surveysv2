import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';
import TimeWheel from '../ui/TimeWheel';

interface TimeSlotPickerProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  dateHasBooking?: boolean;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ 
  selectedTime, 
  onTimeSelect, 
  dateHasBooking = false 
}) => {
  // helpers to convert between 24h value (form) and 12h display (TimeWheel)
  const to12h = (value?: string) => {
    if (!value) return '';
    // expect HH:MM
    const m = value.match(/^(\d{2}):(\d{2})$/);
    if (!m) return value;
    const h = parseInt(m[1], 10);
    const mm = m[2];
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${mm} ${period}`;
  };
  const to24h = (display?: string) => {
    if (!display) return '';
    // handle already 24h
    if (/^\d{2}:\d{2}$/.test(display)) return display;
    const m = display.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return display;
    let hour = parseInt(m[1], 10);
    const minute = m[2];
    const period = m[3].toUpperCase();
    if (period === 'AM') {
      hour = hour % 12;
    } else {
      hour = hour % 12 + 12;
    }
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  };

  const displayValue = useMemo(() => to12h(selectedTime), [selectedTime]);

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
        <Clock className="w-4 h-4 mr-2" />
        {dateHasBooking ? 'This date is fully booked' : 'Select a Time'}
      </h3>

      {dateHasBooking ? (
        <p className="text-sm text-gray-500">
          This date already has a booking. Only one booking is allowed per day.
        </p>
      ) : (
        <TimeWheel
          value={displayValue}
          onChange={(val) => {
            const v24 = to24h(val);
            if (v24) onTimeSelect(v24);
          }}
        />
      )}
    </div>
  );
};

export default TimeSlotPicker;

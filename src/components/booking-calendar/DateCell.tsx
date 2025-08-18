import React from 'react';

interface DateCellProps {
  date: Date;
  isSelected: boolean;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  isWeekend: boolean;
  isSameDay: boolean;
  isAvailable: boolean;
  isBooked: boolean;
  hasBookings: boolean;
  isAdmin: boolean;
  onClick: () => void;
  onDateClick: (date: Date, e?: React.MouseEvent) => void;
  // Optional mouse handlers for drag selection in admin block mode
  onMouseDown?: (date: Date, e: React.MouseEvent) => void;
  onMouseEnter?: (date: Date, e: React.MouseEvent) => void;
  onMouseUp?: (date: Date, e: React.MouseEvent) => void;
  adminBlockMode?: boolean;
}

const DateCell: React.FC<DateCellProps> = ({
  date,
  isSelected,
  isCurrentMonth,
  isToday,
  isPast,
  isWeekend,
  isSameDay,
  isAvailable,
  isBooked,
  hasBookings,
  isAdmin,
  onDateClick,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  adminBlockMode = false
}) => {
  const formatDateForUI = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  let buttonClasses = "w-full h-full min-h-[44px] rounded-md flex flex-col items-center justify-center transition-colors p-1.5";
  
  if (isSelected) {
    buttonClasses += " bg-blue-900 text-white hover:bg-blue-800";
  } else if (!isCurrentMonth) {
    buttonClasses += " text-gray-400";
  } else if (isToday) {
    buttonClasses += " border border-blue-500 text-blue-900";
  } else if (isAdmin && hasBookings) {
    buttonClasses += " bg-yellow-50 text-gray-700 hover:bg-yellow-100 cursor-pointer";
  } else if (isPast || !isAvailable || isSameDay) {
    buttonClasses += " bg-gray-100 text-gray-400 cursor-not-allowed";
  } else if (isBooked) {
    buttonClasses += " bg-red-50 text-red-700";
  } else if (isWeekend) {
    buttonClasses += " bg-gray-50 text-gray-500";
  } else {
    buttonClasses += " bg-white hover:bg-blue-50 text-gray-700";
  }
  if (isAdmin && adminBlockMode) {
    buttonClasses += " cursor-crosshair";
  }
  
  return (
    <button
      onClick={(e) => onDateClick(date, e)}
      onMouseDown={(e) => onMouseDown && onMouseDown(date, e)}
      onMouseEnter={(e) => onMouseEnter && onMouseEnter(date, e)}
      onMouseUp={(e) => onMouseUp && onMouseUp(date, e)}
      className={buttonClasses}
      disabled={!isAdmin && (isPast || !isAvailable || isSameDay)}
      aria-label={formatDateForUI(date)}
      aria-selected={isSelected}
      aria-disabled={!isAdmin && (isPast || !isAvailable || isSameDay)}
    >
      <span className="text-sm font-semibold">{date.getDate()}</span>
      {isCurrentMonth && (
        <div className="mt-1">
          {isAdmin && hasBookings && (
            <div className="w-4 h-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-[8px]">1</span>
            </div>
          )}
          {!isAdmin && isBooked && (
            <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-[8px] text-red-700">X</span>
            </div>
          )}
          {!isAdmin && isSameDay && (
            <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-[8px] text-gray-700">Today</span>
            </div>
          )}
        </div>
      )}
    </button>
  );
};

export default DateCell;

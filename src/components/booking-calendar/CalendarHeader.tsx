import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onGoToCurrentMonth: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  onGoToCurrentMonth
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPreviousMonth}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <h2 className="text-xl font-semibold">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        
        <button
          onClick={onNextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Next month"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      <button
        onClick={onGoToCurrentMonth}
        className="w-full py-1 text-sm text-blue-600 hover:text-blue-800"
      >
        Jump to Current Month
      </button>
    </div>
  );
};

export default CalendarHeader;

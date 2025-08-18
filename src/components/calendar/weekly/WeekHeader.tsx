import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekHeaderProps {
  currentWeekStart: Date;
  currentWeekEnd: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onGoToCurrentWeek: () => void;
}

export const WeekHeader: React.FC<WeekHeaderProps> = ({
  currentWeekStart,
  currentWeekEnd,
  onPreviousWeek,
  onNextWeek,
  onGoToCurrentWeek
}) => {
  // Format date for header display
  const formatHeaderDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Get current week info text
  const getWeekInfoText = () => {
    const weekNum = Math.ceil((currentWeekStart.getDate() - currentWeekStart.getDay() + 
      (currentWeekStart.getDay() === 0 ? 1 : 0)) / 7) + 1;
    
    const year = currentWeekStart.getFullYear();
    const month = currentWeekStart.toLocaleString('default', { month: 'long' });
    
    return `${month} ${year} - Week ${weekNum}`;
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onPreviousWeek}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <div className="text-sm font-semibold">
            {formatHeaderDate(currentWeekStart)} - {formatHeaderDate(currentWeekEnd)}
          </div>
          <div className="text-xs text-gray-500">{getWeekInfoText()}</div>
        </div>
        
        <button
          onClick={onNextWeek}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Next week"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <button 
        onClick={onGoToCurrentWeek}
        className="mt-1 text-xs text-blue-600 hover:text-blue-800 w-full text-center py-1"
      >
        Jump to Current Week
      </button>
    </div>
  );
};

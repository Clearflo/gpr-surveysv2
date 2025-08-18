import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface BlockDateModalProps {
  date: Date;
  onClose: () => void;
  onBlock: (duration: 'under-4' | 'over-4') => Promise<void>;
}

export const BlockDateModal: React.FC<BlockDateModalProps> = ({ date, onClose, onBlock }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<'under-4' | 'over-4'>('over-4');

  const handleBlock = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onBlock(duration);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to block date');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-blue-900" />
            Block Date
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">
            Selected Date: {date.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Block Duration
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDuration('under-4')}
                className={`p-3 border-2 rounded-lg text-left transition-colors duration-200 ${
                  duration === 'under-4'
                    ? 'border-blue-900 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <div className="font-semibold mb-1">Half Day</div>
                <div className="text-xs text-gray-600">Under 4 hours</div>
              </button>
              <button
                type="button"
                onClick={() => setDuration('over-4')}
                className={`p-3 border-2 rounded-lg text-left transition-colors duration-200 ${
                  duration === 'over-4'
                    ? 'border-blue-900 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <div className="font-semibold mb-1">Full Day</div>
                <div className="text-xs text-gray-600">Over 4 hours</div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleBlock}
            disabled={isLoading}
            className="px-4 py-2 text-sm bg-blue-900 text-white rounded hover:bg-blue-800 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Blocking...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Block Date
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

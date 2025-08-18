import React, { useEffect, useMemo, useRef, useState } from 'react';

interface TimeWheelProps {
  value?: string; // "h:mm AM"
  onChange: (time: string) => void;
  className?: string;
}

function formatTime12h(hour: number, minute: number, period: 'AM' | 'PM') {
  const h = hour === 0 ? 12 : hour; // keep 1-12
  const mm = minute.toString().padStart(2, '0');
  return `${h}:${mm} ${period}`;
}

const ITEM_HEIGHT = 36; // px

export const TimeWheel: React.FC<TimeWheelProps> = ({ value, onChange, className = '' }) => {
  // Build 30-min increments from 4:00 AM to 11:30 PM
  const times = useMemo(() => {
    const res: string[] = [];
    // start 04:00, end 23:30
    for (let h24 = 4; h24 <= 23; h24++) {
      for (const m of [0, 30]) {
        if (h24 === 23 && m === 30) {
          res.push(formatTime12h(((h24 + 11) % 12) + 1, m, h24 < 12 ? 'AM' : 'PM'));
          break;
        }
        res.push(formatTime12h(((h24 + 11) % 12) + 1, m, h24 < 12 ? 'AM' : 'PM'));
      }
    }
    return res;
  }, []);

  const listRef = useRef<HTMLDivElement>(null);

  // pick initial index based on value or default to 9:00 AM if available
  const initialIndex = useMemo(() => {
    if (value) {
      const idx = times.findIndex((t) => t.toUpperCase() === value.toUpperCase());
      if (idx >= 0) return idx;
    }
    const nine = times.findIndex((t) => t === '9:00 AM');
    return nine >= 0 ? nine : 0;
  }, [times, value]);

  const [index, setIndex] = useState(initialIndex);

  // Sync external value
  useEffect(() => {
    if (!value) return;
    const idx = times.findIndex((t) => t.toUpperCase() === value.toUpperCase());
    if (idx >= 0) setIndex(idx);
  }, [times, value]);

  // Emit change when index changes
  useEffect(() => {
    const t = times[index];
    if (t) onChange(t);
  }, [index, times, onChange]);

  // Scroll helpers
  const scrollToIndex = (i: number, behavior: ScrollBehavior = 'smooth') => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: i * ITEM_HEIGHT, behavior });
  };

  useEffect(() => {
    // center selection on mount without animation
    scrollToIndex(index, 'auto');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSnap = () => {
    const el = listRef.current;
    if (!el) return;
    const i = Math.round(el.scrollTop / ITEM_HEIGHT);
    const bounded = Math.max(0, Math.min(times.length - 1, i));
    scrollToIndex(bounded);
    setIndex(bounded);
  };

  return (
    <div className={`w-full bg-white border border-gray-300 rounded-md relative select-none ${className}`}>
      {/* highlight row */}
      <div
        className="pointer-events-none absolute left-0 right-0"
        style={{ top: ITEM_HEIGHT, height: ITEM_HEIGHT, boxShadow: 'inset 0 0 0 1px rgba(30,58,138,0.2)' }}
      />

      <div className="grid" style={{ height: ITEM_HEIGHT * 3 }}>
        <div
          ref={listRef}
          className="overflow-y-auto snap-y snap-mandatory scroll-smooth"
          style={{ scrollSnapType: 'y mandatory' }}
          onScroll={(e) => {
            const el = e.currentTarget;
            window.clearTimeout((el as any)._snapTimer);
            (el as any)._snapTimer = window.setTimeout(onSnap, 80);
          }}
        >
          {/* padding */}
          <div style={{ height: ITEM_HEIGHT }} />
          {times.map((t, i) => (
            <div key={t} className="h-9 flex items-center justify-center snap-start">
              <button
                type="button"
                className={`px-2 py-1 rounded text-sm tabular-nums ${index === i ? 'text-blue-900 font-semibold' : 'text-gray-700'}`}
                onClick={() => {
                  setIndex(i);
                  scrollToIndex(i);
                }}
                aria-selected={index === i}
              >
                {t}
              </button>
            </div>
          ))}
          <div style={{ height: ITEM_HEIGHT }} />
        </div>
      </div>

      <div className="flex items-center justify-between p-2 border-t border-gray-200 text-xs text-gray-500">
        <span>Scroll to select time</span>
        <div className="flex gap-2">
          <button
            type="button"
            className="px-2 py-1 border rounded hover:bg-gray-50"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            Prev
          </button>
          <button
            type="button"
            className="px-2 py-1 border rounded hover:bg-gray-50"
            onClick={() => setIndex((i) => Math.min(times.length - 1, i + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeWheel;

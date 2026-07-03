"use client";

import { useState, useMemo } from "react";
import { endOfMonth } from "date-fns/endOfMonth";
import { endOfWeek } from "date-fns/endOfWeek";
import { addMonths } from "date-fns/addMonths";
import { addDays } from "date-fns/addDays";
import { isBefore } from "date-fns/isBefore";
import { isAfter } from "date-fns/isAfter";
import { isSameMonth } from "date-fns/isSameMonth";
import { isSameDay } from "date-fns/isSameDay";
import { isWeekend } from "date-fns/isWeekend";
import {
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  formatDate,
  WORKING_DAYS,
  MAX_BOOKING_DAYS_AHEAD,
  BOOKING_LEAD_TIME_HOURS,
} from "@/lib/booking-config";

type Props = {
  onChange: (dateString: string) => void;
  selectedDate?: string;
};

export default function DatePicker({ onChange, selectedDate }: Props) {
  const now = useMemo(() => startOfDay(new Date()), []);
  const minDate = useMemo(() => {
    const d = new Date();
    d.setUTCHours(d.getUTCHours() + BOOKING_LEAD_TIME_HOURS);
    return startOfDay(d);
  }, []);
  const maxDate = useMemo(() => addDays(now, MAX_BOOKING_DAYS_AHEAD), [now]);

  const [viewMonth, setViewMonth] = useState(() => startOfMonth(now));

  const canGoNext = useMemo(
    () => isBefore(viewMonth, startOfMonth(maxDate)) || isSameMonth(viewMonth, startOfMonth(maxDate)),
    [viewMonth, maxDate]
  );
  const canGoPrev = useMemo(
    () => !isBefore(viewMonth, startOfMonth(now)),
    [viewMonth, now]
  );

  const calendarStart = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 1 });

  const days: Date[] = [];
  let current = calendarStart;
  while (isBefore(current, calendarEnd) || isSameDay(current, calendarEnd)) {
    days.push(current);
    current = addDays(current, 1);
  }

  const isSelectable = (date: Date): boolean => {
    if (isBefore(date, minDate) || isAfter(date, maxDate)) return false;
    if (!WORKING_DAYS.includes(date.getUTCDay())) return false;
    return true;
  };

  const handleSelect = (date: Date) => {
    if (!isSelectable(date)) return;
    onChange(formatDate(date, "yyyy-MM-dd"));
  };

  return (
    <div className="rounded-lg border border-gold/20 bg-navy-light p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          disabled={!canGoPrev}
          className="rounded-md p-2 text-cream hover:bg-gold/10 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous month"
        >
          &lt;
        </button>
        <h3 className="font-serif text-lg font-semibold text-gold">
          {formatDate(viewMonth, "MMMM yyyy")}
        </h3>
        <button
          type="button"
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          disabled={!canGoNext}
          className="rounded-md p-2 text-cream hover:bg-gold/10 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next month"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-cream/70 mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, idx) => {
          const disabled = !isSelectable(date);
          const selected = selectedDate ? isSameDay(date, new Date(selectedDate + "T00:00:00Z")) : false;
          const currentMonth = isSameMonth(date, viewMonth);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(date)}
              disabled={disabled}
              className={[
                "aspect-square rounded-md text-sm flex items-center justify-center transition-colors",
                selected
                  ? "bg-gold text-navy font-semibold"
                  : currentMonth
                    ? "text-cream hover:bg-gold/10"
                    : "text-cream/30",
                disabled && !selected ? "opacity-30 cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
            >
              {formatDate(date, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

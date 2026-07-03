"use client";

import { useEffect, useState } from "react";

type Props = {
  selectedDate?: string;
  refreshKey?: number;
  onChange: (timeSlot: string) => void;
};

export default function TimeSlotPicker({ selectedDate, refreshKey = 0, onChange }: Props) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      setSelectedSlot(null);
      onChange("");
      return;
    }

    let cancelled = false;

    async function fetchSlots() {
      if (!selectedDate) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/consultation-availability?date=${encodeURIComponent(selectedDate)}`
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Failed to load slots");
        }

        const available: string[] = await res.json();
        if (!cancelled) {
          setSlots(available);
          setSelectedSlot(null);
          onChange("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load slots");
          setSlots([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchSlots();

    return () => {
      cancelled = true;
    };
  }, [selectedDate, refreshKey, onChange]);

  const handleSelect = (slot: string) => {
    setSelectedSlot(slot);
    onChange(slot);
  };

  return (
    <div className="rounded-lg border border-gold/20 bg-navy-light p-4 sm:p-6">
      <h3 className="font-serif text-lg font-semibold text-gold mb-4">
        {selectedDate ? "Available Time Slots" : "Select a date first"}
      </h3>

      {error && (
        <p className="text-sm text-rose-400 mb-4">{error}</p>
      )}

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-md bg-navy/50 border border-gold/10"
            />
          ))}
        </div>
      )}

      {!loading && !error && selectedDate && slots.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-cream/70">
            No slots available this day — try another date
          </p>
        </div>
      )}

      {!loading && !error && slots.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {slots.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => handleSelect(slot)}
              className={[
                "h-12 rounded-md border text-sm font-medium transition-colors",
                selectedSlot === slot
                  ? "border-gold bg-gold text-navy"
                  : "border-gold/30 bg-navy text-cream hover:border-gold hover:bg-gold/10",
              ].join(" ")}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

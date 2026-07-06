import { addDays } from "date-fns/addDays";
import { addHours } from "date-fns/addHours";
import { isAfter } from "date-fns/isAfter";
import { isBefore } from "date-fns/isBefore";
import { endOfMonth } from "date-fns/endOfMonth";
import { endOfWeek } from "date-fns/endOfWeek";
import { addMonths } from "date-fns/addMonths";
import { isSameMonth } from "date-fns/isSameMonth";
import { isSameDay } from "date-fns/isSameDay";
import { isWeekend } from "date-fns/isWeekend";

export { addDays } from "date-fns/addDays";
export { addHours } from "date-fns/addHours";
export { isAfter } from "date-fns/isAfter";
export { isBefore } from "date-fns/isBefore";
export { endOfMonth } from "date-fns/endOfMonth";
export { endOfWeek } from "date-fns/endOfWeek";
export { addMonths } from "date-fns/addMonths";
export { isSameMonth } from "date-fns/isSameMonth";
export { isSameDay } from "date-fns/isSameDay";
export { isWeekend } from "date-fns/isWeekend";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function toUTCMidnight(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function startOfDay(date: Date): Date {
  return toUTCMidnight(date);
}

export function startOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function startOfWeek(date: Date, options?: { weekStartsOn?: number }): Date {
  const weekStartsOn = options?.weekStartsOn ?? 0;
  const day = date.getUTCDay();
  const diff = (day + 7 - weekStartsOn) % 7;
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - diff));
}

export function subMonths(date: Date, amount: number): Date {
  const result = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - amount, date.getUTCDate()));
  return result;
}

export function formatDate(date: Date, pattern: string): string {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  if (pattern === "MMMM yyyy") {
    return `${MONTH_NAMES[month]} ${year}`;
  }
  if (pattern === "yyyy-MM-dd") {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  if (pattern === "d") {
    return String(day);
  }
  return date.toISOString().split("T")[0] ?? "";
}

export const BUSINESS_HOURS = {
  start: 9,
  end: 17,
};

export const WORKING_DAYS: number[] = [1, 2, 3, 4, 5];

export const SLOT_DURATION_MINUTES = 45;

export const BOOKING_LEAD_TIME_HOURS = 24;

export const MAX_BOOKING_DAYS_AHEAD = 30;

export const CONSULTATION_FEE_GHS = 350;

export function generateTimeSlots(date: Date): string[] {
  const normalized = toUTCMidnight(date);
  const slots: string[] = [];

  const totalMinutes = (BUSINESS_HOURS.end - BUSINESS_HOURS.start) * 60;
  const count = totalMinutes / SLOT_DURATION_MINUTES;

  for (let i = 0; i < count; i++) {
    const total = BUSINESS_HOURS.start * 60 + i * SLOT_DURATION_MINUTES;
    const hour = Math.floor(total / 60);
    const minute = total % 60;
    slots.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
  }

  return slots;
}

export function isWithinBookingWindow(date: Date): boolean {
  const normalized = toUTCMidnight(date);
  const now = new Date();
  const earliest = addHours(now, BOOKING_LEAD_TIME_HOURS);
  const latest = addDays(now, MAX_BOOKING_DAYS_AHEAD);

  const start = toUTCMidnight(earliest);
  const end = toUTCMidnight(latest);

  return isAfter(normalized, start) || normalized.getTime() === start.getTime();
}

export function isWorkingDay(date: Date): boolean {
  return WORKING_DAYS.includes(date.getUTCDay());
}

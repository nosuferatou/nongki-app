"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { CalendarDays, ChevronDown } from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";

type EventDateRangePickerProps = {
  inputClassName: string;
  labelClassName: string;
  initialStartDate?: string;
  initialEndDate?: string;
};

function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

function formatFormDateTime(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

function formatSelectionDate(date: Date, time: string): string {
  return format(combineDateAndTime(date, time), "MMM d, yyyy h:mm a");
}

export default function EventDateRangePicker({
  inputClassName,
  labelClassName,
  initialStartDate,
  initialEndDate,
}: EventDateRangePickerProps) {
  const initialStart = initialStartDate ? new Date(initialStartDate) : undefined;
  const initialEnd = initialEndDate ? new Date(initialEndDate) : undefined;
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(
    initialStart && initialEnd
      ? { from: initialStart, to: initialEnd }
      : undefined,
  );
  const [startTime, setStartTime] = useState(
    initialStart ? format(initialStart, "HH:mm") : "10:00",
  );
  const [endTime, setEndTime] = useState(
    initialEnd ? format(initialEnd, "HH:mm") : "12:00",
  );
  const pickerRef = useRef<HTMLDivElement>(null);

  const startDateTime = range?.from
    ? combineDateAndTime(range.from, startTime)
    : undefined;
  const endDateTime = range?.to
    ? combineDateAndTime(range.to, endTime)
    : undefined;
  const hasCompleteRange = Boolean(startDateTime && endDateTime);
  const isValidRange =
    hasCompleteRange &&
    startDateTime !== undefined &&
    endDateTime !== undefined &&
    endDateTime >= startDateTime;

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !pickerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const triggerLabel =
    range?.from && range.to
      ? `${formatSelectionDate(range.from, startTime)} – ${formatSelectionDate(range.to, endTime)}`
      : range?.from
        ? `${formatSelectionDate(range.from, startTime)} – Select end date`
        : "Select date & time";

  return (
    <div className="space-y-1.5">
      <label htmlFor="event-timeframe" className={labelClassName}>
        Date &amp; Time <span aria-hidden="true">*</span>
      </label>
      <div
        ref={pickerRef}
        className={`relative ${isOpen ? "z-50" : "z-0"}`}
      >
        <button
          id="event-timeframe"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className={`${inputClassName} mt-0 flex min-h-12 w-full items-center justify-between gap-3 rounded-xl text-left focus:ring-2 focus:outline-none`}
        >
          <span className="flex min-w-0 items-center gap-3">
            <CalendarDays
              aria-hidden="true"
              size={18}
              className="shrink-0 text-slate-400 dark:text-[#ACC5A6]/70"
            />
            <span className="truncate">
              {triggerLabel}
              {!isValidRange && (
                <span className="ml-1 text-red-600" aria-hidden="true">
                  *
                </span>
              )}
            </span>
          </span>
          <ChevronDown
            aria-hidden="true"
            size={18}
            className={`shrink-0 text-slate-400 transition-transform dark:text-[#ACC5A6]/70 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div
            role="dialog"
            aria-label="Choose event dates and times"
            className="absolute left-0 top-full z-50 mt-2 w-full min-w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_32px_rgba(15,23,42,0.12)] dark:border-[#5C7057]/50 dark:bg-[#3b4a38] dark:shadow-none sm:w-auto"
          >
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              defaultMonth={range?.from}
              numberOfMonths={1}
              className="nongki-date-range-calendar mx-auto"
            />

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200/60 pt-4 dark:border-[#5C7057]/50">
              <div>
                <label
                  htmlFor="event-start-time"
                  className="mb-1.5 block text-[13px] font-medium text-slate-500 dark:text-[#ACC5A6]"
                >
                  Start time
                </label>
                <input
                  id="event-start-time"
                  type="time"
                  value={startTime}
                  required
                  onChange={(event) => setStartTime(event.target.value)}
                  className="block h-11 w-full rounded-xl border border-slate-200/60 bg-white px-3 text-sm text-slate-800 focus:border-primary-light focus:outline-none focus:ring-4 focus:ring-primary-light/40 dark:border-[#5C7057]/50 dark:bg-[#2b3629] dark:text-[#D1EDD3]"
                />
              </div>
              <div>
                <label
                  htmlFor="event-end-time"
                  className="mb-1.5 block text-[13px] font-medium text-slate-500 dark:text-[#ACC5A6]"
                >
                  End time
                </label>
                <input
                  id="event-end-time"
                  type="time"
                  value={endTime}
                  required
                  onChange={(event) => setEndTime(event.target.value)}
                  className="block h-11 w-full rounded-xl border border-slate-200/60 bg-white px-3 text-sm text-slate-800 focus:border-primary-light focus:outline-none focus:ring-4 focus:ring-primary-light/40 dark:border-[#5C7057]/50 dark:bg-[#2b3629] dark:text-[#D1EDD3]"
                />
              </div>
            </div>

            {hasCompleteRange && !isValidRange && (
              <p role="alert" className="mt-3 text-sm text-red-600 dark:text-rose-300">
                The end date and time must not be before the start.
              </p>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={!isValidRange}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-secondary-light/40 px-4 py-2.5 text-sm font-semibold text-secondary-dark transition-all hover:bg-secondary-light active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-primary-light/40 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#5C7057]/40 dark:text-[#D1EDD3] dark:hover:bg-[#5C7057]/70"
            >
              Done
            </button>
          </div>
        )}
      </div>

      <input
        type="hidden"
        name="eventDate"
        value={startDateTime ? formatFormDateTime(startDateTime) : ""}
      />
      <input
        type="hidden"
        name="endDate"
        value={endDateTime ? formatFormDateTime(endDateTime) : ""}
      />
    </div>
  );
}

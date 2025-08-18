import React, { useState } from "react";

// --- HELPER FUNCTION FOR TIME SLOTS ---
/**
 * Generates hourly time slots between a given start and end time.
 * The slots are rounded up from the start time and down to the end time.
 * E.g., from "18:44" to "20:43" will generate "7:00 PM", "8:00 PM".
 * @param {string} fromTimeStr - Start time in "HH:MM" 24-hour format.
 * @param {string} toTimeStr - End time in "HH:MM" 24-hour format.
 * @returns {string[]} An array of time slots in "H:MM AM/PM" format.
 */
const generateHourlyTimeSlots = (
  fromTimeStr: string,
  toTimeStr: string,
): string[] => {
  const slots: string[] = [];
  const [startHour, startMinute] = fromTimeStr.split(":").map(Number);
  const [endHour, endMinute] = toTimeStr.split(":").map(Number);

  // Calculate the actual starting hour for the slots (round up if not on the hour)
  let currentHour = startMinute > 0 ? startHour + 1 : startHour;

  // Ensure we don't start past the end hour
  if (
    currentHour > endHour ||
    (currentHour === endHour && startMinute > endMinute)
  ) {
    return []; // No valid slots if start is after end
  }

  while (currentHour <= endHour) {
    // If currentHour is the endHour, ensure currentMinute is not past endMinute
    if (currentHour === endHour && 0 > endMinute) {
      break; // Stop if we've passed the actual end minute
    }

    const period = currentHour >= 12 ? "PM" : "AM";
    const displayHour = currentHour % 12 === 0 ? 12 : currentHour % 12;
    slots.push(`${displayHour}:00 ${period}`);

    currentHour++;
  }
  return slots;
};

// Helper to compare times for filtering 'To Time'
const isTimeLaterOrSame = (time1: string, time2: string): boolean => {
  const parseTime = (timeStr: string): number => {
    const [h, p] = timeStr.split(" ");
    let [hour, minute] = h.split(":").map(Number);
    if (p === "PM" && hour !== 12) hour += 12;
    if (p === "AM" && hour === 12) hour = 0; // Midnight
    return hour * 60 + minute;
  };
  return parseTime(time1) <= parseTime(time2);
};

// --- DUMMY COMPONENTS FOR DEMONSTRATION ---
// In a real application, you would import these from your UI library (e.g., shadcn/ui)
// or define them as actual components with full calendar/button logic.

// A placeholder Calendar component for visual demonstration
interface CalendarProps {
  className?: string;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  availableDays: string[]; // e.g., ['Monday', 'Tuesday']
}

const Calendar = ({
  className,
  selectedDate,
  setSelectedDate,
  availableDays,
}: CalendarProps) => {
  const today = new Date();
  const [displayMonth, setDisplayMonth] = useState(today.getMonth());
  const [displayYear, setDisplayYear] = useState(today.getFullYear());

  // Get days in the current display month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get the day of the week for the first day of the month (0 for Sunday, 1 for Monday...)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleMonthChange = (offset: number) => {
    let newMonth = displayMonth + offset;
    let newYear = displayYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setDisplayMonth(newMonth);
    setDisplayYear(newYear);
  };

  const isDaySelectable = (day: number) => {
    const date = new Date(displayYear, displayMonth, day);
    const dayName = date.toLocaleString("default", { weekday: "long" });
    return availableDays.includes(dayName);
  };

  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <button
          className="p-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => handleMonthChange(-1)}
          aria-label="Previous Month"
        >
          &lt;
        </button>
        <span className="font-semibold text-gray-800 text-lg">
          {new Date(displayYear, displayMonth).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          className="p-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => handleMonthChange(1)}
          aria-label="Next Month"
        >
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 font-semibold mb-2">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>
      <div className="grid grid-cols-7 text-center gap-y-2">
        {Array.from({
          length: getFirstDayOfMonth(displayYear, displayMonth),
        }).map((_, i) => (
          <span key={`empty-${i}`} className="p-1"></span> // Empty cells for leading days
        ))}
        {Array.from({ length: getDaysInMonth(displayYear, displayMonth) }).map(
          (_, i) => {
            const day = i + 1;
            const isSelected =
              selectedDate &&
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === displayMonth &&
              selectedDate.getFullYear() === displayYear;
            const isSelectable = isDaySelectable(day);

            return (
              <span
                key={day}
                className={`p-2 rounded-full cursor-pointer transition-colors
                ${isSelected ? " rounded-md bg-gradient-to-r from-purple-400 to-pink-600 text-white hover:from-purple-400 hover:to-pink-600 " : "text-gray-800 hover:bg-gray-100"}
                ${!isSelectable ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
                onClick={() =>
                  isSelectable &&
                  setSelectedDate(new Date(displayYear, displayMonth, day))
                }
              >
                {day}
              </span>
            );
          },
        )}
      </div>
    </div>
  );
};

// A placeholder Button component for visual demonstration
const Button = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`w-full px-4 py-2 rounded-md font-medium border transition-colors duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-royalblue-500 focus:border-royalblue-500
      ${className}`}
  >
    {children}
  </button>
);

// --- MAIN COMPONENT ---
interface CalendarAndTimeslotsProps {
  availableFromTime: string; // e.g., "18:44"
  availableToTime: string; // e.g., "20:43"
  availableDays: string[]; // e.g., ['Tuesday', 'Monday', 'Wednesday']
  selectedDate: Date | undefined;
  setSelectedDate: (data: any) => void;
  selectedFromTime: string | null;
  setSelectedFromTime: (time: string | null) => void;
  selectedToTime: string | null;
  setSelectedToTime: (time: string | null) => void;
}

function CalendarAndTimeslots({
  availableFromTime,
  availableToTime,
  availableDays,
  selectedDate,
  setSelectedDate,
  selectedFromTime,
  setSelectedFromTime,
  selectedToTime,
  setSelectedToTime,
}: CalendarAndTimeslotsProps) {
  const allAvailableSlots = generateHourlyTimeSlots(
    availableFromTime,
    availableToTime,
  );

  // Filter 'To Time' slots based on 'From Time' selection
  const filteredToTimeSlots = selectedFromTime
    ? allAvailableSlots.filter((time) =>
        isTimeLaterOrSame(selectedFromTime, time),
      )
    : allAvailableSlots;

  return (
    <div className="space-y-8 p-6 bg-gray-50 rounded-lg">
      {" "}
      {/* Added padding and a subtle background for the container */}
      {/* Calendar Section */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2">
          Select Date
        </h3>
        <Calendar
          className="rounded-lg border border-gray-200 shadow-sm"
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          availableDays={availableDays}
        />
        <p className="text-sm text-gray-500 mt-4 leading-relaxed">
          <span className="font-medium text-gray-600">
            * Dates not available are greyed out.
          </span>{" "}
          Mobile services are available throughout Lagos.
        </p>
      </div>
      {selectedDate && ( // Only show time selection if a date is selected
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2">
            Select Time Duration
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {" "}
            {/* Two columns for From/To */}
            {/* From Time Selection */}
            <div>
              <p className="font-semibold text-gray-700 mb-3">From Time</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allAvailableSlots.map((time) => (
                  <Button
                    key={`from-${time}`}
                    onClick={() => {
                      setSelectedFromTime(time);
                      // If 'to' time becomes invalid after 'from' time change, reset 'to'
                      if (
                        selectedToTime &&
                        !isTimeLaterOrSame(time, selectedToTime)
                      ) {
                        setSelectedToTime(null);
                      }
                    }}
                    className={
                      selectedFromTime === time
                        ? "bg-royalblue-shade2 hover:bg-royalblue-shade3 text-white shadow-md"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                    }
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
            {/* To Time Selection */}
            <div>
              <p className="font-semibold text-gray-700 mb-3">To Time</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredToTimeSlots.map((time) => (
                  <Button
                    key={`to-${time}`}
                    onClick={() => setSelectedToTime(time)}
                    className={
                      selectedToTime === time
                        ? "bg-royalblue-shade2 hover:bg-royalblue-shade3 text-white shadow-md"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                    }
                  >
                    {time}
                  </Button>
                ))}
                {filteredToTimeSlots.length === 0 && selectedFromTime && (
                  <p className="text-sm text-gray-500 col-span-full">
                    No end times available after selected start time.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Display selected date and time for confirmation (optional) */}
      {(selectedDate || selectedFromTime || selectedToTime) && (
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-lg font-semibold text-gray-800">
            Selected Appointment:
          </p>
          <p className="text-md text-gray-700 mt-2">
            {selectedDate?.toDateString()}{" "}
            {selectedFromTime && `from ${selectedFromTime}`}{" "}
            {selectedToTime && `to ${selectedToTime}`}
          </p>
        </div>
      )}
    </div>
  );
}

export default CalendarAndTimeslots;

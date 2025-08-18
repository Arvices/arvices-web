import React, { useState } from "react";
const generateHourlyTimeSlots = (
  fromTimeStr: string,
  toTimeStr: string,
): string[] => {
  const slots: string[] = [];
  const [startHour, startMinute] = fromTimeStr.split(":").map(Number);
  const [endHour, endMinute] = toTimeStr.split(":").map(Number);
  let currentHour = startMinute > 0 ? startHour + 1 : startHour;
  if (
    currentHour > endHour ||
    (currentHour === endHour && startMinute > endMinute)
  ) {
    return [];
  }
  while (currentHour <= endHour) {
    if (currentHour === endHour && 0 > endMinute) {
      break;
    }
    const period = currentHour >= 12 ? "PM" : "AM";
    const displayHour = currentHour % 12 === 0 ? 12 : currentHour % 12;
    slots.push(`${displayHour}:00 ${period}`);
    currentHour++;
  }
  return slots;
};
const isTimeLaterOrSame = (time1: string, time2: string): boolean => {
  const parseTime = (timeStr: string): number => {
    const [h, p] = timeStr.split(" ");
    let [hour, minute] = h.split(":").map(Number);
    if (p === "PM" && hour !== 12) hour += 12;
    if (p === "AM" && hour === 12) hour = 0;
    return hour * 60 + minute;
  };
  return parseTime(time1) <= parseTime(time2);
};
interface CalendarProps {
  className?: string;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  availableDays: string[];
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
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
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
    const dayName = date.toLocaleString("default", {
      weekday: "long",
    });
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
          <span key={`empty-${i}`} className="p-1"></span>
        ))}
        {Array.from({
          length: getDaysInMonth(displayYear, displayMonth),
        }).map((_, i) => {
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
        })}
      </div>
    </div>
  );
};
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
interface CalendarAndTimeslotsProps {
  availableFromTime: string;
  availableToTime: string;
  availableDays: string[];
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
  const filteredToTimeSlots = selectedFromTime
    ? allAvailableSlots.filter((time) =>
        isTimeLaterOrSame(selectedFromTime, time),
      )
    : allAvailableSlots;
  return (
    <div className="space-y-8 p-6 bg-gray-50 rounded-lg">
      {" "}
      {}
      {}
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
      {selectedDate && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2">
            Select Time Duration
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {" "}
            {}
            {}
            <div>
              <p className="font-semibold text-gray-700 mb-3">From Time</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allAvailableSlots.map((time) => (
                  <Button
                    key={`from-${time}`}
                    onClick={() => {
                      setSelectedFromTime(time);
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
            {}
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
      {}
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

export const getTimeValue = (str: string | null): string => {
  if (!str) return "09:00";
  if (str.includes(":")) return str;
  const match = str.match(/^(\d+)(am|pm)$/i);
  if (!match) return "09:00";
  let hour = parseInt(match[1], 10);
  const period = match[2].toLowerCase();
  if (period === "pm" && hour !== 12) hour += 12;
  if (period === "am" && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, "0")}:00`;
};
export const formatTimeForSave = (time: string): string => {
  const [hourStr] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? "pm" : "am";
  hour = hour % 12 || 12;
  return `${hour}${period}`;
};
export function convertToReadableTime(time: string): string {
  const [hour] = time.split(":").map(Number);
  const isPM = hour >= 12;
  const formattedHour = hour % 12 || 12;
  const suffix = isPM ? "pm" : "am";
  return `${formattedHour}${suffix}`;
}
export function formatTime(date: Date): string {
  return date.toTimeString().slice(0, 5);
}

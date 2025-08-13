import { Conversation, Message } from "../store/messageSlice";

export function generateConversation(
  id: number,
  conversationDate: string,
  fullName: string,
  picture: string | null,
  lastMessage: Message | null,
): Conversation {
  return {
    id,
    conversationdate: conversationDate,
    fullName,
    picture,
    lastmessage: lastMessage,
    unreadCount: 0,
  };
}
export const formatCount = (count: number | null): string => {
  if (count === null) {
    return "0";
  }
  if (count <= 0) {
    return "0";
  }
  if (count < 10) {
    return String(count);
  }
  if (count >= 50) {
    return "50+";
  }
  if (count >= 40) {
    return "40+";
  }
  if (count >= 30) {
    return "30+";
  }
  if (count >= 20) {
    return "20+";
  }
  if (count >= 10) {
    return "10+";
  }
  return String(count);
};

export const formatRating = (rating: number) => {
  if (rating === undefined || rating === null) {
    return "0.0";
  }
  // Check if the number has a decimal part.
  // The modulo operator (%) returns the remainder of a division.
  // If `rating % 1` is not 0, it means the number is not an integer.
  if (rating % 1 !== 0) {
    return rating.toFixed(1); // Keep one decimal place if it already has one.
  } else {
    // If it's an integer, append ".0"
    return rating.toFixed(1);
  }
};

export const formatTimeWithAmPm = (time24hr: string): string => {
  if (!time24hr || typeof time24hr !== "string" || !time24hr.includes(":")) {
    console.error("Invalid time format. Expected 'HH:MM'.");
    return "Invalid Time";
  }

  const [hourStr, minuteStr] = time24hr.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (
    isNaN(hour) ||
    isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    console.error("Invalid time values. Hour must be 0-23, minute 0-59.");
    return "Invalid Time";
  }

  const ampm = hour >= 12 ? "PM" : "AM";
  let formattedHour = hour % 12;

  // Handle midnight (00:xx) and noon (12:xx)
  if (formattedHour === 0) {
    formattedHour = 12; // 00:xx becomes 12:xx AM, 12:xx becomes 12:xx PM
  }

  // Ensure minutes are always two digits
  const formattedMinute = minute < 10 ? `0${minute}` : String(minute);

  return `${formattedHour}:${formattedMinute} ${ampm}`;
};

// Example Usage:
// console.log(formatTimeWithAmPm("09:00")); // Output: 9:00 AM
// console.log(formatTimeWithAmPm("13:45")); // Output: 1:45 PM

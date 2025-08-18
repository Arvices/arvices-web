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
  if (rating % 1 !== 0) {
    return rating.toFixed(1);
  } else {
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
  if (formattedHour === 0) {
    formattedHour = 12;
  }
  const formattedMinute = minute < 10 ? `0${minute}` : String(minute);
  return `${formattedHour}:${formattedMinute} ${ampm}`;
};

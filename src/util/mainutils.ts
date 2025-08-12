import { Conversation, Message } from "../store/messageSlice";

export function generateConversation(
  id: number,
  name: string,
  conversationDate: string,
  fullName: string,
  picture: string | null,
  lastMessage: Message
): Conversation {
  return {
    id,
    name,
    conversationdate: conversationDate,
    fullName,
    picture,
    lastmessage: lastMessage,
  };
}
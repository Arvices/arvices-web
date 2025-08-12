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
  };
}

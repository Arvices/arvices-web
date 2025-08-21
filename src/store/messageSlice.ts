import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserAccount } from "../api-services/auth";
export interface Conversation {
  id: number;
  conversationdate: string;
  fullName: string;
  picture: string | null;
  lastmessage: Message | null;
  unreadCount: number | null;
}
export interface Message {
  id: number;
  message: string;
  read: boolean;
  createdDate: string;
  user: UserAccount;
  toUser: UserAccount;
}
interface MessageState {
  messages: Record<string, Message[]>;
  conversations: Conversation[];
}
const initialState: MessageState = {
  messages: {},
  conversations: [],
};

export function sortConversationsByLastMessage(
  conversations: Conversation[],
): Conversation[] {
  return [...conversations].sort((a, b) => {
    const dateA = a.lastmessage
      ? new Date(a.lastmessage.createdDate).getTime()
      : 0;
    const dateB = b.lastmessage
      ? new Date(b.lastmessage.createdDate).getTime()
      : 0;

    return dateB - dateA; // newest first
  });
}

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (
      state,
      action: PayloadAction<{
        conversationId: string;
        messages: Message[];
      }>,
    ) => {
      const { conversationId, messages } = action.payload;
      console.log({
        conversationId,
        messages,
      });
      const existing = state.messages[conversationId] || [];
      console.log({
        existing,
      });
      const combined = [...existing, ...messages];
      const unique = removeDuplicateMessages(combined);
      console.log("UNIQUE : ", unique);
      state.messages[conversationId] = unique;
    },
    addMessage: (
      state,
      action: PayloadAction<{
        conversationId: string;
        message: Message;
      }>,
    ) => {
      const { conversationId, message } = action.payload;
      const existing = state.messages[conversationId] || [];
      state.messages[conversationId] = removeDuplicateMessages([
        message,
        ...existing,
      ]);
      const convoIndex = state.conversations.findIndex(
        (c) => String(c.id) === String(conversationId),
      );
      if (convoIndex !== -1) {
        state.conversations[convoIndex] = {
          ...state.conversations[convoIndex],
          lastmessage: message,
        };
      }
    },

    clearMessages: (state, action: PayloadAction<number | null>) => {
      const conversationId = action.payload;
      if (conversationId !== null) {
        delete state.messages[conversationId];
      } else {
        state.messages = {};
      }
    },

    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      console.log({
        inSetConversations: action,
      });
      let combined = [...state.conversations, ...action.payload];
      let unique = removeDuplicateConversations(combined);
      state.conversations = unique;
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations.push(action.payload);
    },
    clearConversations: (state) => {
      state.conversations = [];
    },
    updateUnreadCount: (
      state,
      action: PayloadAction<{
        conversationId: number;
        count: number | null;
      }>,
    ) => {
      const { conversationId, count } = action.payload;
      const conversation = state.conversations.find(
        (c) => c.id === conversationId,
      );
      if (conversation) {
        conversation.unreadCount = count;
      }
    },
    increaseUnreadCount: (
      state,
      action: PayloadAction<{
        conversationId: number;
      }>,
    ) => {
      const { conversationId } = action.payload;
      const conversation = state.conversations.find(
        (c) => c.id === conversationId,
      );
      if (conversation) {
        conversation.unreadCount = (conversation.unreadCount || 0) + 1;
      }
    },
  },
});
export const {
  setMessages,
  addMessage,
  clearMessages,
  setConversations,
  addConversation,
  clearConversations,
  updateUnreadCount,
  increaseUnreadCount,
} = messageSlice.actions;
export default messageSlice.reducer;
const removeDuplicateMessages = (messages: Message[]): Message[] => {
  const seen = new Set();
  return messages.filter((msg) => {
    if (seen.has(msg.id)) return false;
    seen.add(msg.id);
    return true;
  });
};
const removeDuplicateConversations = (
  conversations: Conversation[],
): Conversation[] => {
  const seen = new Set();
  return conversations.filter((conv) => {
    if (seen.has(conv.id)) return false;
    seen.add(conv.id);
    return true;
  });
};

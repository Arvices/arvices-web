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
  createdDate: string; // ISO string from the API
  user: UserAccount; // sender
  toUser: UserAccount; // receiver
}

interface MessageState {
  messages: Record<string, Message[]>; // keyed by conversationId
  conversations: Conversation[];
}

const initialState: MessageState = {
  messages: {},
  conversations: [],
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (
      state,
      action: PayloadAction<{ conversationId: string; messages: Message[] }>,
    ) => {
      const { conversationId, messages } = action.payload;
      console.log({ conversationId, messages });
      const existing = state.messages[conversationId] || [];
      console.log({ existing });
      const combined = [...existing, ...messages];
      const unique = removeDuplicateMessages(combined);
      console.log("UNIQUE : ", unique);
      state.messages[conversationId] = unique;
    },

    // Add a single message to a conversation
    // Add a single message to a conversation
    addMessage: (
      state,
      action: PayloadAction<{ conversationId: string; message: Message }>,
    ) => {
      const { conversationId, message } = action.payload;

      // Update messages list for this conversation
      const existing = state.messages[conversationId] || [];
      state.messages[conversationId] = removeDuplicateMessages([
        message,
        ...existing,
      ]);

      // Also update the conversation's last message
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

    // Clear messages for a specific conversation
    clearMessages: (state, action: PayloadAction<number>) => {
      const conversationId = action.payload;
      delete state.messages[conversationId];
    },

    // ---- Conversations ----
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      console.log({ inSetConversations: action });
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

    // New reducer to update the unread count
    updateUnreadCount: (
      state,
      action: PayloadAction<{ conversationId: number; count: number | null }>,
    ) => {
      const { conversationId, count } = action.payload;
      const conversation = state.conversations.find(
        (c) => c.id === conversationId,
      );
      if (conversation) {
        conversation.unreadCount = count;
      }
    }, // Corrected reducer to increase the unread count
    increaseUnreadCount: (
      state,
      action: PayloadAction<{ conversationId: number }>,
    ) => {
      const { conversationId } = action.payload;
      const conversation = state.conversations.find(
        (c) => c.id === conversationId,
      );
      if (conversation) {
        // Correctly handle null or 0 unreadCount and then increment
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

// ---- Helpers ----
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

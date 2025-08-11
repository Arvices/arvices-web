import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ArviceNotification {
  id: string;
  header: string;
  message: string;
  read: boolean;
  createdAt: string;
  meta_type: string;
}

export interface ArviceNotificationRequestPayload {
  message: string;
  header: string;
  userId: number;
}

interface NotificationState {
  notifications: ArviceNotification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<ArviceNotification[]>) => {
      console.log({ inSetNotification: action });
      state.notifications = action.payload;
    },
    addNotification: (state, action: PayloadAction<ArviceNotification>) => {
      state.notifications.unshift(action.payload); // put newest at top
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload,
      );
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;

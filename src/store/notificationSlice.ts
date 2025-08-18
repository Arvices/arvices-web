import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface ArviceNotification {
  id: number;
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
      console.log({
        inSetNotification: action,
      });
      let combined = [...state.notifications, ...action.payload];
      let unique = removeDuplicateNotifications(combined);
      state.notifications = unique;
    },
    addNotification: (state, action: PayloadAction<ArviceNotification>) => {
      console.log({
        inSliceAddNotification: action.payload,
      });
      const newArr = [action.payload, ...state.notifications];
      const unique = newArr.filter(
        (notif, index, self) =>
          index === self.findIndex((n) => n.id === notif.id),
      );
      state.notifications = unique;
    },
    markAsRead: (state, action: PayloadAction<number>) => {
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
export const removeDuplicateNotifications = (
  notifications: ArviceNotification[],
): ArviceNotification[] => {
  const seen = new Set<string | number>();
  return notifications.filter((n) => {
    if (seen.has(n.id)) {
      return false;
    }
    seen.add(n.id);
    return true;
  });
};

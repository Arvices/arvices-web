import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../store/userSlice";
import notificationReducer from "../store/notificationSlice";
import messageSlice from "../store/messageSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer,
    message: messageSlice,
  },
  devTools: import.meta.env.MODE !== "production",
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

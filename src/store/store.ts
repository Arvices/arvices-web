import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../store/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    // Add more slices here
  },
  devTools: import.meta.env.MODE !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserAccount } from "../api-services/auth";
interface UserState {
  isAuthenticated: boolean;
  token: string | null;
  email: string | null;
  name: string | null;
  avatar: string | null;
  favourites: UserAccount[];
}
const initialState: UserState = {
  isAuthenticated: false,
  token: null,
  email: null,
  name: null,
  avatar: null,
  favourites: [],
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        token: string;
        email: string;
        name?: string;
        avatar?: string;
        favourite?: UserAccount[];
      }>,
    ) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.name = action.payload.name ?? null;
      state.avatar = action.payload.avatar ?? null;
      state.favourites = action.payload.favourite ?? [];
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.email = null;
      state.name = null;
      state.avatar = null;
      state.favourites = [];
    },
    updateProfile: (
      state,
      action: PayloadAction<{
        name?: string;
        avatar?: string;
        favourites?: UserAccount[];
      }>,
    ) => {
      if (action.payload.name) state.name = action.payload.name;
      if (action.payload.avatar) state.avatar = action.payload.avatar;
      if (action.payload.favourites)
        state.favourites = action.payload.favourites;
    },
  },
});
export const { setUser, clearUser, updateProfile } = userSlice.actions;
export default userSlice.reducer;

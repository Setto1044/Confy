import { createSlice } from "@reduxjs/toolkit";
const STATIC_IMAGE_URL = import.meta.env.VITE_STATIC_IMAGE_URL;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    login: (state, action) => {
      const profileUrl = action.payload.profileUrl
        ? action.payload.profileUrl.startsWith("http")
          ? action.payload.profileUrl
          : `${STATIC_IMAGE_URL}${action.payload.profileUrl}`
        : null;

      state.user = { ...action.payload, profileUrl };
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [], // ✅ `undefined` 방지
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = [...action.payload];
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
  },
});

export const { setNotifications, addNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;

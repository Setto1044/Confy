import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  meetingId: sessionStorage.getItem("meetingId") || "",
  isConnected: false,
};

const startMeetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {
    setMeetingId: (state, action) => {
      state.meetingId = action.payload;
      sessionStorage.setItem("meetingId", action.payload);
    },
    clearMeetingId: (state) => {
      state.meetingId = "";
      sessionStorage.removeItem("meetingId");
    },
  },
});

// 액션과 리듀서 내보내기
export const { setMeetingId, clearMeetingId } = startMeetingSlice.actions;
export default startMeetingSlice.reducer;

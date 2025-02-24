import { createSlice } from "@reduxjs/toolkit";

// ✅ LocalStorage에서 초기 데이터 불러오기
const loadMeetingFromStorage = () => {
  const savedMeeting = localStorage.getItem("meetingInfo");
  return savedMeeting ? JSON.parse(savedMeeting) : null;
};

// 초기 상태
const initialState = {
  meeting: loadMeetingFromStorage(), // ✅ LocalStorage에서 불러오기
};

const meetingInfoSlice = createSlice({
  name: "meetingInfo",
  initialState,
  reducers: {
    setMeetingInfo: (state, action) => {
      // console.log("🔍 setMeetingInfo 실행됨, payload:", action.payload);

      if (JSON.stringify(state.meeting) !== JSON.stringify(action.payload)) {
        state.meeting = { ...state.meeting, ...action.payload };

        // ✅ LocalStorage에도 저장
        localStorage.setItem("meetingInfo", JSON.stringify(state.meeting));

        // console.log("✅ Redux 상태 업데이트 후:", state.meeting);
      } else {
        // console.log("🚀 Redux 상태 동일, 업데이트 안함");
      }
    },
    clearMeetingInfo: (state) => {
      state.meeting = null;
      localStorage.removeItem("meetingInfo"); // ✅ LocalStorage에서도 삭제
    },
  },
});

export const { setMeetingInfo, clearMeetingInfo } = meetingInfoSlice.actions;
export default meetingInfoSlice.reducer;

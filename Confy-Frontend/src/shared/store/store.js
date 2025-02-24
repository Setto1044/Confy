import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import meetingReducer from "./meetingSlice";
import groupReducer from "./groupSlice";
import meetingIdReducer from "./meetingIdSlice";
import meetingInfoReducer from "./meetingInfoSlice";
import notificationReducer from "./notificationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer, // 로그인 관련 상태
    meeting: meetingReducer, // 회의 목록 관련 상태
    group: groupReducer,
    meetingId: meetingIdReducer, // 회의 진행중 사용자의 meetingId 관련 상태
    meetingInfo: meetingInfoReducer, // ✅ 회의 정보 상태 추가
    notification: notificationReducer,
  },
  devTools: import.meta.env.MODE !== "production", // 개발 환경에서만 DevTools 활성화
});

export default store;

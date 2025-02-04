import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import meetingReducer from "./meetingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer, // 로그인 관련 상태
    meeting: meetingReducer, // 회의 목록 관련 상태
  },
  devTools: import.meta.env.MODE !== "production",
});

export default store;

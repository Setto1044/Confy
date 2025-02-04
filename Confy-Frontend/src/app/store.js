import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../entities/auth/model/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: import.meta.env.MODE !== "production", // 개발 환경에서만 DevTools 활성화
});

export default store;

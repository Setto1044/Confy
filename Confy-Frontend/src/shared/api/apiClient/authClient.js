// HTTP Header : Content-Type만 필요한 API용
// auth관련

import axios from "axios";
import { API_BASE_URL } from "../../config/config";

const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 인터셉터: JWT 토큰 자동 추가
authClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터: 에러 처리
authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "❌ 인증 API 요청 실패:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default authClient;

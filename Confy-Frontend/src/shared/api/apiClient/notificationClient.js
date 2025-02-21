import axios from "axios";
import { API_BASE_URL } from "../../config/config";

const notificationClient = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ 요청 인터셉터 - JWT 토큰 자동 추가
notificationClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ 응답 인터셉터 - 에러 처리
notificationClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "❌ 알림 API 요청 실패:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default notificationClient;

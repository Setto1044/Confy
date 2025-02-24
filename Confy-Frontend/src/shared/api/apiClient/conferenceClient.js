// HTTP Header : Authorization,Content-Type 필요한 API용
// 화상회의, 시각화 데이터 저장 관련

import axios from "axios";
import { API_BASE_URL } from "../../config/config";

const conferenceClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 자동 추가
conferenceClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // console.log("🔹 최종 요청 헤더: ", config.headers); // ✅ 헤더 확인용
  return config;
});

conferenceClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ 화상회의 API 요청 실패:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default conferenceClient;
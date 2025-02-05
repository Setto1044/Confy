// Content-Type만 필요한 API용

import axios from "axios";
import { API_BASE_URL } from "../config/config";

const defaultClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

defaultClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API 요청 실패:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default defaultClient;
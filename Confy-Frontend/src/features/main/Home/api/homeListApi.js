import { useEffect } from "react";
import authClient from "../../../../shared/api/apiClient/authClient";

// ✅ 예약된 회의 조회 API 요청 함수
export const fetchScheduledMeetings = async () => {
  try {
    const response = await authClient.get("/notifications/scheduled-meetings");

    if (!response.data) {
      throw new Error("예약된 회의 데이터를 불러오지 못했습니다.");
    }

    return response.data;
  } catch (error) {
    console.error(
      "❌ 예약된 회의 조회 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default { get: fetchScheduledMeetings };

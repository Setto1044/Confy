import conferenceClient from "../../../../shared/api/apiClient/conferenceClient";

/**
 * 특정 시간대 스크립트 요약 요청 API
 * @param {string} meetingId - 회의 ID
 * @param {string} startTime - 요약할 시작 시간
 * @param {string} endTime - 요약할 종료 시간
 * @returns {Promise<object>} - 성공 시 { success: true, data: { summary } } 반환
 */

export const fetchMeetingSummary = async (meetingId, startTime, endTime) => {
  try {
    const response = await conferenceClient.post(
      `/meetings/room/${meetingId}/summary`,
      {
        startTime: startTime.toString(), // ✅ 문자열로 변환
        endTime: endTime.toString(), // ✅ 문자열로 변환
      }
    );

    if (response.data.success) {
      return response.data.data.summary;
    } else {
      throw new Error(`서버 응답 오류: ${response.data.message}`);
    }
  } catch (error) {
    console.error("🚨 회의 요약 요청 오류:", error.response || error.message);

    if (error.response) {
      console.error("🔍 서버 응답 데이터:", error.response.data);
    }

    throw new Error(error.response?.data?.message || "회의 요약 중 오류 발생");
  }
};

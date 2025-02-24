import conferenceClient from "../../../../shared/api/apiClient/conferenceClient";

/**
 * 회의 나가기 API 요청 함수
 * @param {string} meetingId - 나갈 회의의 ID
 * @returns {Promise<object>} - 성공 시 { success: true, message: "회의 나가기 성공" } 반환
 * @throws {Error} - 실패 시 에러 메시지 반환
 */

export const exitMeeting = async (meetingId) => {
  try {
    const response = await conferenceClient.patch(`/meetings/room/${meetingId}/exit`, {});

    // 응답 데이터 구조 확인 후 반환
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "회의 나가기 실패");
    }
  } catch (error) {
    console.error("🚨 회의 나가기 요청 오류:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "회의 나가기 중 오류 발생");
  }
};

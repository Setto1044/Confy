import conferenceClient from "../../../../shared/api/apiClient/conferenceClient";

/**
 * 회의 참여자 목록 가져오기 API 요청 함수
 * @param {string} meetingId - 조회할 회의 ID
 * @returns {Promise<Array>} - 성공 시 참여자 목록 배열 반환
 * @throws {Error} - 실패 시 에러 메시지 반환
 */

export const getParticipantsList = async (meetingId) => {
  try {
    // console.log("🔹 API 요청 시작: ", `/meetings/room/${meetingId}/speakers`);
    // console.log("🔹 현재 headers 값: ", conferenceClient.defaults.headers);

    const response = await conferenceClient.get(`/meetings/room/${meetingId}/speakers`, {
      headers: {
        "Content-Type": "application/json",  // ✅ GET 요청에서도 Content-Type 추가
      },
    });

    // console.log("🔹 API 응답 데이터: ", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message || "참여자 목록 조회 실패");
    }

    return response.data.data.speakers;
  } catch (error) {
    console.error("🚨 참여자 목록 요청 오류:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "참여자 목록 불러오는 중 오류 발생");
  }
};

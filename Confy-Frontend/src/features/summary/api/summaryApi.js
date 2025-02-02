import apiClient from "../../../shared/api/apiClient";
 // ✅ 환경 변수에서 불러오기

// ✅ 회의 요약 정보 조회 API
export const getMeetingSummary = async (meetingId) => {
  const finalMeetingId = meetingId // ✅ 테스트 ID 적용

  if (!finalMeetingId) throw new Error("❌ meetingId가 필요합니다.");

  const response = await apiClient.get(`/meetings/results/${finalMeetingId}/summary`);
  return response.data?.data;
};

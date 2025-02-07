import defaultClient from "../../../shared/api/apiClient/defaultClient";

// ✅ 내가 참여한 모든 회의 리스트 조회
export const getMeetingList = async (meetingId) => {
  const finalMeetingId = meetingId;

  if (!finalMeetingId) throw new Error("❌ meetingId가 필요합니다.");

  const response = await defaultClient.get(
    `/meetings/results?type=all&cursor={id}&size={N}`
  );
  return response.data?.data?.script || [];
};

// ✅ 특정 그룹 회의 리스트 리스트 조회

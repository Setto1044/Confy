import meetinglistClient from "../../../../shared/api/apiClient/meetinglistClient";

export const getMeetingList = async (
  type = "all",
  groupId = null,
  cursor = null,
  size = 10
) => {
  try {
    const params = { type, size };
    if (cursor) params.cursor = cursor;
    if (type === "group" && groupId) params["group-id"] = groupId;

    const response = await meetinglistClient.get("/results", { params });

    if (!response.data.success) {
      throw new Error(
        response.data.message || "회의 리스트 조회에 실패했습니다."
      );
    }
    return response.data.data?.meetings || [];
  } catch (error) {
    console.error("❌ 회의 리스트 조회 실패:", error.message);
    throw error; // 예외를 던져서 `fetchMeetings`에서 감지
  }
};

// ✅ 즐겨찾기한 회의 목록 조회 API 요청 함수 추가
export const getFavoriteMeetings = async (cursor = null, size = 10) => {
  try {
    const params = { type: "favorite", size };
    if (cursor) params.cursor = cursor;

    const response = await meetinglistClient.get("/results", { params });

    if (!response.data.success) {
      throw new Error(
        response.data.message || "즐겨찾기 회의 조회에 실패했습니다."
      );
    }
    return response.data.data?.meetings || [];
  } catch (error) {
    console.error("❌ 즐겨찾기 회의 리스트 조회 실패:", error.message);
    throw error;
  }
};

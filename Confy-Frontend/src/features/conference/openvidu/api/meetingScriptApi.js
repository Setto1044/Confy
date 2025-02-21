import conferenceClient from "../../../../shared/api/apiClient/conferenceClient";

export const fetchScript = async (meetingId) => {
  try {
    const response = await conferenceClient.get(
      `/meetings/room/${meetingId}/script`
    );

    if (response.status !== 200) {
      throw new Error(`서버 응답 오류: ${response.status}`);
    }

    const data = response.data;

    if (data.success) {
      console.log("📜 전체 스크립트 로드 성공:", data.data.script);
      return data.data.script;
    } else {
      console.error("❌ 스크립트 데이터 로드 실패:", data.message);
      return [];
    }
  } catch (error) {
    console.error("❌ 네트워크 오류 또는 API 요청 실패:", error);
    return [];
  }
};

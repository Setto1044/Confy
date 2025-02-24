import defaultClient from "../../../shared/api/apiClient/defaultClient";

// ✅ 스크립트 데이터 조회 API
export const fetchScript = async (meetingId) => {
  const finalMeetingId = meetingId;
  if (!finalMeetingId) throw new Error("❌ meetingId가 필요합니다.");

  const response = await defaultClient.get(
    `/meetings/results/${finalMeetingId}/scripts`
  );
  return response.data?.data?.script || [];
};

// ✅ 특정 회의 키워드 조회 API
export const fetchKeywords = async (meetingId) => {
  if (!meetingId) throw new Error("❌ meetingId가 필요합니다.");

  try {
    const response = await defaultClient.get(
      `/meetings/results/${meetingId}/keywords`
    );

    if (response.data.success) {
      return response.data.data.keywords; // ✅ 키워드 배열 반환
    } else {
      throw new Error(response.data.message || "회의 키워드 조회 실패");
    }
  } catch (error) {
    console.error("❌ Error fetching keywords:", error);
    throw error;
  }
};

// ✅ 요약 데이터 조회 API
export const fetchSummary = async (meetingId) => {
  const finalMeetingId = meetingId;

  try {
    const response = await defaultClient.get(
      `/meetings/results/${finalMeetingId}/summary`
    );
    if (response.data.success) {
      return response.data.data; // ✅ Markdown 형식의 요약 반환
    } else {
      throw new Error(response.data.message || "회의 요약 조회 실패");
    }
  } catch (error) {
    console.error("❌ Error fetching meeting summary:", error);
    throw error;
  }
};

// ✅ 요약 수정 모드 전환 API
export const enterEditMode = async (meetingId) => {
  if (!meetingId) throw new Error("❌ meetingId가 필요합니다.");

  try {
    const response = await defaultClient.get(
      `/meetings/results/${meetingId}/summary/edit`
    );

    if (response.data.success) {
      return response.data; // "회의 요약 수정 모드 전환 성공"
    } else {
      throw new Error(response.data.message || "회의 요약 수정 모드 전환 실패");
    }
  } catch (error) {
    console.error("❌ Error entering edit mode:", error);
    throw error;
  }
};

// ✅ 회의 요약 수정 API
export const updateSummary = async (meetingId, updatedSummary) => {
  if (!meetingId) throw new Error("❌ meetingId가 필요합니다.");

  try {
    const response = await defaultClient.post(
      `/meetings/results/${meetingId}/summary/save`,
      { data: updatedSummary } // ✅ "data" → "summary" 필드로 변경 (API 확인 필요)
    );

    if (response.data.success) {
      return response.data.message; // "회의 요약 수정 성공"
    } else {
      throw new Error(response.data.message || "회의 요약 수정 실패");
    }
  } catch (error) {
    console.error("❌ Error updating summary:", error);
    throw error;
  }
};

// ✅ 시각화 데이터 조회 API
export const fetchVisualization = async (meetingId) => {
  const finalMeetingId = meetingId;

  try {
    const response = await defaultClient.get(
      `/meetings/results/${finalMeetingId}/visual`
    );

    if (response.data.success && response.data.data) {
      let parsedData;

      try {
        // ✅ 데이터가 JSON 문자열로 들어오므로 한 번 더 파싱
        parsedData = JSON.parse(response.data.data);
      } catch (error) {
        console.error("❌ JSON 데이터 파싱 오류:", error);
        throw new Error("시각화 데이터 변환 실패");
      }

      const { agendaItems, relations } = parsedData;

      // ✅ 기존 구조(nodes, edges)에 맞게 변환하여 반환
      const formattedData = {
        nodes: agendaItems.map((item) => ({
          id: item.id,
          data: { label: item.data.idea }, // `label` 대신 `idea`
          position: item.position,
          type: item.type || "default", // `type`이 없으면 "default"
        })),
        edges: relations.map((relation) => ({
          id: relation.id,
          source: relation.source,
          target: relation.target,
          type: "smoothstep",
        })),
      };

      return { success: true, message: response.data.message, data: formattedData };
    } else {
      throw new Error(response.data.message || "회의 시각화 조회 실패");
    }
  } catch (error) {
    console.error("❌ Error fetching meeting visualization:", error);
    throw error;
  }
};



// ✅ 특정 회의 참가자 정보 조회 API
export const fetchParticipants = async (meetingId) => {
  if (!meetingId) throw new Error("❌ meetingId가 필요합니다.");

  try {
    const response = await defaultClient.get(
      `/meetings/results/${meetingId}/participants`
    );
    if (response.data.success) {
      return response.data.data.participants; // ✅ 참가자 배열 반환
    } else {
      throw new Error(response.data.message || "회의 참가자 조회 실패");
    }
  } catch (error) {
    console.error("❌ Error fetching participants:", error);
    throw error;
  }
};

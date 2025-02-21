import defaultClient from "../../../shared/api/apiClient/defaultClient";
import conferenceClient from "../../../shared/api/apiClient/conferenceClient";

const editVisualizationApi = {
  // ✅ 회의 시각 데이터 불러오기 (GET)
  fetchVisualizationData: async (meetingId) => {
    try {
      const response = await defaultClient.get(`/meetings/results/${meetingId}/visual/edit`);
      // console.log("✅ 수정 페이지 전환 성공:", response.data.data);
      
      return response.data; 
    } catch (error) {
      console.error("❌ 수정 페이지 전환 실패:", error.response?.data || error);
      
      // 에러 발생 시 빈 visual 객체 반환
      return { success: false, message: "수정 페이지 전환 실패", data: { nodes: [], edges: [] } };
    }
  },

  // ✅ 수정된 데이터 저장 API (POST)
  updateVisualizationData: async (meetingId, visualData) => {
    try {
      // console.log("🔍 API 요청을 받았습니다. visualData:", visualData);
  
      if (!visualData || !visualData.data) {
        throw new Error("❌ visualData 구조가 올바르지 않습니다. (data 필드 없음)");
      }
  
      // ✅ visualData.data가 JSON 문자열인지 확인 후 파싱
      let parsedData;
      try {
        parsedData = typeof visualData.data === "string" ? JSON.parse(visualData.data) : visualData.data;
      } catch (error) {
        throw new Error("❌ visualData.data JSON 파싱 실패");
      }
  
      // console.log("✅ visualData.data JSON 변환 완료:", parsedData);
  
      if (!parsedData.nodes || !parsedData.edges) {
        throw new Error("❌ visualData 데이터 구조가 올바르지 않습니다.");
      }
  
      // ✅ nodes → agendaItems 변환
      const agendaItems = parsedData.nodes.map((node) => ({
        id: node.id,
        type: node.type || "default",
        data: { idea: node.data.label }, // `label` → `idea` 변경
        position: node.position,
      }));
  
      // ✅ edges → relations 변환
      const relations = parsedData.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      }));
  
      // ✅ 백엔드가 요구하는 형식으로 JSON 변환 (이중 stringify 제거)
      const formattedData = JSON.stringify({ agendaItems, relations });
      const payload = { data: formattedData };
  
      // console.log("🔍 변환된 payload 확인:", payload);
  
      const response = await conferenceClient.post(
        `/meetings/results/${meetingId}/visual/save`,
        payload
      );
  
      // console.log("✅ 수정된 시각 데이터 저장 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ 수정된 시각 데이터 저장 실패:", error);
      return { success: false, message: "서버 오류로 저장에 실패했습니다." };
    }
  }
  
  
  
};

export default editVisualizationApi;

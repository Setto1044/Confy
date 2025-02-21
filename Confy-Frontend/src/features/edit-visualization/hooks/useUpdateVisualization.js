import { useMutation, useQueryClient } from "@tanstack/react-query";
import editVisualizationApi from "../api/editVisualizationApi";
import { useNavigate } from "react-router-dom";

// ✅ 시각화 수정 저장 (React Query Mutation)
export const useUpdateVisualization = (meetingId) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ nodes = [], edges = [] }) => {
      // console.log("🚀 updateVisualizationData 실행 시작:", meetingId, nodes, edges);

      // ✅ `data`를 JSON 문자열로 변환
      const requestData = { data: JSON.stringify({ nodes, edges: edges || [] }) };
      // console.log("📡 API 요청 데이터:", requestData);

      const result = await editVisualizationApi.updateVisualizationData(meetingId, requestData);
      // console.log("✅ updateVisualizationData 실행 완료:", result);
      return { result, nodes, edges }; // ✅ nodes, edges를 함께 반환하여 onSuccess에서 활용
    }, 

    onSuccess: async ({ result, nodes, edges }) => {
      if (result.success) {
        console.log("✅ 시각화 데이터 업데이트 성공:", result);

        // ✅ 기존 데이터가 없는 경우 기본 구조 유지
        queryClient.setQueryData(["meetingVisualization", meetingId], (oldData) => ({
          ...oldData,
          data: result.data || { nodes: nodes || [], edges: edges || [] }, // ✅ 백엔드 응답이 없으면 프론트에서 보낸 데이터 사용
        }));

        // ✅ 최신 데이터 요청 (비동기 처리)
        await queryClient.invalidateQueries(["meetingVisualization", meetingId]);

        alert("저장되었습니다!");
        
        // ✅ SummaryPage로 이동하며 최신 데이터 반영
        navigate(`/meetings/${meetingId}/summary`, {
          state: {
            refreshVisualization: true, 
            meeting: { id: meetingId }  // ✅ SummaryPage에서 사용할 meeting 정보 전달
          }
        });

      } else {
        console.error("❌ 수정 저장 실패:", result);
        alert("❌ 수정 저장 실패: " + result.message);
      }
    },

    onError: (error) => {
      console.error("❌ 수정 저장 중 오류 발생:", error);
      alert("저장 중 문제가 발생했습니다.");
    },
  });
};

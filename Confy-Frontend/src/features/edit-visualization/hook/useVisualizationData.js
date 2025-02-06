// 리액트 쿼리로 시각화 조회 데이터 가져오기
import { useQuery } from "@tanstack/react-query";
import { getMeetingVisualization } from "../api/visualizationApi";

export const useVisualizationData = (meetingId) => {
  return useQuery({
    queryKey: ["meetingVisualization", meetingId],
    queryFn: () => getMeetingVisualization(meetingId),
    staleTime: 1000 * 60 * 5,
  });
};
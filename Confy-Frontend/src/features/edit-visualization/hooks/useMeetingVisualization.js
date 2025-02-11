// 리액트 쿼리로 시각화 조회 데이터 가져오기 (시각화 수정 페이지 새로고침 시 데이터 유지)
import { useQuery } from "@tanstack/react-query";
import { getMeetingVisualization } from "../api/visualizationApi";

export const useMeetingVisualization = (meetingId) => {
  return useQuery({
    queryKey: ["meetingVisualization", meetingId],
    queryFn: () => getMeetingVisualization(meetingId),
    staleTime: 1000 * 60 * 5,
  });
};
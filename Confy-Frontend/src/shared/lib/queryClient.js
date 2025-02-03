import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분 동안 캐싱
      cacheTime: 1000 * 60 * 10, // 10분 후에 캐시 삭제
      refetchOnWindowFocus: false, // 창이 포커스를 받을 때 자동 리패치 방지
    },
  },
});

export default queryClient;

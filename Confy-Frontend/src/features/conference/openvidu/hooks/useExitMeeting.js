import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { exitMeeting } from "../api/exitMeetingApi";
import { clearMeetingId } from "../../../../shared/store/meetingIdSlice";

/**
 * 회의 나가기 기능을 제공하는 커스텀 훅
 * @returns {Object} { handleExitMeeting, isLoading, error }
 */
const useExitMeeting = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Redux에서 meetingId 가져오기
  const meetingId = useSelector((state) => state.meetingId.meetingId);

    // ✅ meetingId가 정상적으로 Redux에서 가져와지는지 콘솔 확인
    console.log("🚀 meetingId from Redux:", meetingId);

  /**
   * 회의 나가기 함수
   */
  const handleExitMeeting = async () => {
    if (!meetingId) {
      alert("회의 ID가 없습니다. 다시 시도해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await exitMeeting(meetingId);
      alert(response.message); // "회의 나가기 성공" 메시지 출력

      // ✅ Redux에서 meetingId 삭제
      dispatch(clearMeetingId());

      // ✅ 회의 나가기 성공 후, 메인 페이지 또는 홈으로 이동
      navigate("/main");
    } catch (err) {
      setError(err.message);
      alert(err.message); // 에러 메시지 출력
    } finally {
      setIsLoading(false);
    }
  };

  return { handleExitMeeting, isLoading, error };
};

export default useExitMeeting;

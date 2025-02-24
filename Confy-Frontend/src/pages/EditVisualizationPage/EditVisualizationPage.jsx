import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import EditVisualization from "../../features/edit-visualization/ui/EditVisualization";
import SummaryInfoHeader from "../../features/summary/ui/SummaryInfoHeader/SummaryInfoHeader";
import SummaryHeader from "../../widgets/Header/SummaryHeader";
import { useSelector, useDispatch } from "react-redux"; // ✅ Redux 추가
import { setMeetingInfo } from "../../shared/store/meetingInfoSlice"; // ✅ Redux 액션 추가
import MyCalendar from "../../features/main/Calendar/Calendar";
import styles from "./EditVisualizationPage.module.css";

const EditVisualizationPage = () => {
  const { meetingId: paramMeetingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch(); // ✅ Redux 디스패치 추가

  // ✅ Redux에서 `meeting` 정보 가져오기
  const meeting = useSelector((state) => state.meetingInfo.meeting);

  // ✅ meetingId 설정 (없을 경우 예외 방지)
  const meetingId = paramMeetingId || meeting?.id || location.state?.visualizationData?.meetingId;

  // ✅ meetingId가 없을 경우 홈 페이지로 리디렉트
  useEffect(() => {
    if (!meetingId) {
      console.error("❌ meetingId가 없습니다. 메인 페이지로 이동합니다.");
      navigate("/main");
    }
  }, [meetingId, navigate]);

  // ✅ `useMemo`를 사용해 `visualizationData`를 캐싱
  const visualizationData = useMemo(() => {
    return (
      location.state?.visualizationData ||
      JSON.parse(localStorage.getItem("visualizationData")) || { nodes: [], edges: [] }
    );
  }, [location.state?.visualizationData]);
  // console.log("🔍 시각화 데이터:", visualizationData);

  // ✅ 캘린더 표시 여부 상태
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  // ✅ `localStorage`에 데이터 자동 저장
  useEffect(() => {
    if (visualizationData) {
      localStorage.setItem("visualizationData", JSON.stringify(visualizationData));
    }
  }, [visualizationData]);

  // ✅ 수정 완료 시 최신 데이터 반영
  const handleEditComplete = () => {
    console.log("🔍 현재 Redux 상태 (수정 전):", meeting);
  
    queryClient.invalidateQueries(["meetingVisualization", meetingId]);
    localStorage.removeItem("visualizationData");
  
    const updatedMeeting = { ...meeting, updatedAt: new Date().toISOString() };
    console.log("🔍 업데이트할 Redux 상태:", updatedMeeting);
  
    dispatch(setMeetingInfo(updatedMeeting)); // ✅ Redux 상태 유지
  
    navigate(`/meetings/${meetingId}/summary`);
  };
  
  

  return (
    <div className={`${styles.visualizationPage} ${isCalendarVisible ? styles.withCalendar : ""}`}>
      <SummaryHeader toggleCalendar={() => setIsCalendarVisible((prev) => !prev)} />

      <div className={styles.visualizationContent}>
        <main className={styles.main}>
          <SummaryInfoHeader />

          {/* ✅ meetingId가 없을 때 경고 메시지 표시 */}
          {!meetingId ? (
            <p className="text-center mt-4 text-red-500">❌ 유효한 meetingId가 없습니다.</p>
          ) : !visualizationData ? (
            <p className="text-center mt-4">❌ 시각화 데이터가 없습니다.</p>
          ) : (
            <EditVisualization data={visualizationData} meetingId={meetingId} onEditComplete={handleEditComplete} />
          )}
        </main>

        {/* ✅ 캘린더 기능 유지 */}
        {isCalendarVisible && (
          <aside className={styles.calendarWrapper}>
            <MyCalendar onClose={() => setIsCalendarVisible(false)} />
          </aside>
        )}
      </div>
    </div>
  );
};

export default EditVisualizationPage;

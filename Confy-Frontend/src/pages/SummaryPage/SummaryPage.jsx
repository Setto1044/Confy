import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styles from "../SummaryPage/SummaryPage.module.css";
import SummaryHeader from "../../widgets/Header/SummaryHeader";
import SummaryInfoHeader from "../../features/summary/ui/SummaryInfoHeader/SummaryInfoHeader";
import TabResponsivePanels from "../../features/summary/ui/TabMenu/TabResponsivePanels";
import MyCalendar from "../../features/main/Calendar/Calendar";
import Sidebar from "../../features/main/Sidebar/Sidebar";
import {
  fetchScript,
  fetchSummary,
  fetchVisualization,
} from "../../features/summary/api/summaryApi";
import { setMeetingInfo } from "../../shared/store/meetingInfoSlice";
import { useDispatch, useSelector } from "react-redux";

const SummaryPage = () => {
  const dispatch = useDispatch();
  const storedMeeting = useSelector((state) => state.meetingInfo.meeting);
  const location = useLocation();
  const { meetingId: paramMeetingId } = useParams();
  const meeting = location.state?.meeting || storedMeeting;

  // ✅ meetingId가 없더라도 useQuery가 항상 실행되도록 초기값을 설정
  const meetingId = meeting?.id
    ? String(meeting.id)
    : paramMeetingId
    ? String(paramMeetingId)
    : null;

  // ✅ useState는 항상 같은 순서로 실행되도록 유지
  const [activeTab, setActiveTab] = useState("스크립트");
  const [rightTab, setRightTab] = useState("요약정리");
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [shouldRefreshVisualization, setShouldRefreshVisualization] = useState(
    location.state?.refreshVisualization || false
  );

  // ✅ useQuery에서 enabled 옵션을 추가하여 meetingId가 없을 때 실행되지 않도록 설정
  const { data: scriptData } = useQuery({
    queryKey: ["script", meetingId],
    queryFn: () => fetchScript(meetingId),
    staleTime: Infinity,
    enabled: !!meetingId, // ✅ meetingId가 있을 때만 실행
  });

  const { data: summaryData, refetch: refetchSummary } = useQuery({
    queryKey: ["summary", meetingId],
    queryFn: () => fetchSummary(meetingId),
    enabled: !!meetingId, // ✅ meetingId가 있을 때만 실행
  });

  const { data: visualizationData, refetch: refetchVisualization } = useQuery({
    queryKey: ["visualization", meetingId],
    queryFn: () => fetchVisualization(meetingId),
    enabled: !!meetingId, // ✅ meetingId가 있을 때만 실행
  });

  // ✅ 시각화 데이터 수정 후 리패치
  useEffect(() => {
    if (shouldRefreshVisualization) {
      // console.log("🔄 수정 후 시각화 데이터 리패치 실행!");
      // refetchVisualization().then((updatedData) => {
      //   console.log("✅ refetchVisualization 완료, 최신 데이터:", updatedData);
      // });
      setShouldRefreshVisualization(false);
    }
  }, [shouldRefreshVisualization, refetchVisualization]);

  // ✅ Redux에 meeting 정보 저장 (새로운 meeting 데이터가 있을 경우)
  useEffect(() => {
    if (location.state?.meeting) {
      // ✅ Redux에 저장된 meeting과 location.state.meeting이 다를 때만 업데이트
      if (
        JSON.stringify(storedMeeting) !== JSON.stringify(location.state.meeting)
      ) {
        // console.log("🔍 Redux 상태 업데이트 (location.state.meeting에서 가져옴)");
        dispatch(setMeetingInfo(location.state.meeting));
      }
    }
  }, [location.state?.meeting, dispatch]); // ✅ storedMeeting 제거하여 무한 루프 방지

  // useEffect(() => {
  //   const calendarElement = document.querySelector(
  //     `.${styles.calendarWrapper}`
  //   );
  // }, [isCalendarVisible]);

  // ✅ meetingId가 없을 때는 UI에서 오류 메시지를 표시
  return (
    <div
      className={`${styles.summaryPage} ${
        isCalendarVisible ? styles.withCalendar : ""
      }`}
    >
      {isSidebarVisible && (
        <Sidebar toggleSidebar={() => setIsSidebarVisible(false)} />
      )}

      <div className={styles.summaryContent}>
        <SummaryHeader
          toggleCalendar={() => setIsCalendarVisible(!isCalendarVisible)}
          toggleSidebar={() => setIsSidebarVisible(true)}
          isSidebarVisible={isSidebarVisible}
        />

        {/* ✅ meetingId가 없을 경우 사용자에게 오류 메시지 출력 */}
        {!meetingId ? (
          <p className="text-center text-red-500 text-xl font-bold">
            ❌ 유효한 meetingId가 필요합니다.
          </p>
        ) : (
          <main
            className={`${styles.main} ${
              isCalendarVisible ? styles.withCalendar : ""
            }`}
          >
            <div className={styles.mainList}>
              <SummaryInfoHeader />
              <TabResponsivePanels
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                rightTab={rightTab}
                setRightTab={setRightTab}
                scriptData={scriptData} // 스크립트 데이터 전달
                summaryData={summaryData} // 요약정리 데이터 전달
                refetchSummary={refetchSummary} // 요약정리 갱신 함수 전달
                visualizationData={visualizationData} // 시각화 데이터 전달
                refetchVisualization={refetchVisualization} // 시각화 갱신 함수 전달
                meetingId={meetingId}
              />
            </div>

            {isCalendarVisible && (
              <aside className={styles.calendarWrapper}>
                <MyCalendar onClose={() => setIsCalendarVisible(false)} />
              </aside>
            )}
          </main>
        )}
      </div>
    </div>
  );
};

export default SummaryPage;

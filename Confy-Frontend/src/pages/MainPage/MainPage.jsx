import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../MainPage/MainPage.module.css";
import MeetingList from "../../features/main/MeetingList/ui/MeetingList";
import Sidebar from "../../features/main/Sidebar/Sidebar";
import MainHeader from "../../widgets/Header/MainHeader";
import MyCalendar from "../../features/main/Calendar/Calendar";
import HomeList from "../../features/main/Home/HomeList";
import useMeetingList from "../../features/main/MeetingList/hooks/useMeetingList";

const MainPage = () => {
  // Redux state 사용
  const selectedFilter = useSelector((state) => state.meeting.selectedFilter);
  const selectedGroup = useSelector((state) => state.meeting.selectedGroup);
  const { meetings } = useMeetingList();

  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // ✅ 화면 크기가 1024px 이하이면 Sidebar 자동 닫기
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsSidebarVisible(false);
      }
    };

    // 초기 실행 (렌더링 시 체크)
    handleResize();

    // 윈도우 리사이즈 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`${styles.mainPage} ${
        isCalendarVisible ? styles.withCalendar : ""
      }`}
    >
      {isSidebarVisible && (
        <Sidebar toggleSidebar={() => setIsSidebarVisible(false)} />
      )}
      <div className={styles.mainContent}>
        <MainHeader
          toggleCalendar={() => setIsCalendarVisible(!isCalendarVisible)}
          toggleSidebar={() => setIsSidebarVisible(true)}
          isSidebarVisible={isSidebarVisible}
        />
        <div
          className={`${styles.mainPage} ${
            isCalendarVisible ? styles.withCalendar : ""
          }`}
        >
          {selectedFilter === "home" ? (
            <HomeList />
          ) : (
            <MeetingList meetings={meetings} selectedGroup={selectedGroup} />
          )}
          {isCalendarVisible && (
            <div className={styles.calendarWrapper}>
              <MyCalendar
                meetingList={meetings}
                onClose={() => setIsCalendarVisible(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;

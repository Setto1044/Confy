import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../../shared/store/meetingSlice.js";
import Illustration from "../../../assets/images/login-illustration.png";
import styles from "../Home/HomeList.module.css";
import icons from "../../../shared/icons/index.js";
import useNotifications from "../../../shared/hooks/useNotifications.js";
import { Link } from "react-router-dom";

const HomeList = () => {
  const dispatch = useDispatch();
  const scheduledMeetings = useSelector(
    (state) => state.notification.scheduledMeetings
  );

  const userId = localStorage.getItem("userId");
  const notifications = useNotifications(userId);

  return (
    <div className={styles.homeList}>
      <div className={styles.homeBanner}>
        <div className={styles.textContainer}>
          <h1>
            회의를 더 스마트하게,{" "}
            <span className={styles.highlight}>Confy</span>와 함께!
          </h1>
          <p>
            <span className={styles.strongText}>실시간 요약</span>과
            <span className={styles.strongText}> 직관적인 시각화</span>로 <br />
            더 빠르고 효율적인 회의를 경험하세요
          </p>
          <p className={styles.subText}>
            이제 회의 내용을 놓치지 마세요. Confy가 당신의 회의를 정리해
            드립니다
          </p>
          <div className={styles.buttonGroup}>
            <button
              className={styles.primaryButton}
              onClick={() => dispatch(setFilter("all"))}
            >
              LET'S GO
            </button>
            <button className={styles.secondaryButton}>
              <Link to="/guides">Learn More</Link>
            </button>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <img src={Illustration} alt="Illustration" />
        </div>
      </div>
      <div className={styles.scheduledMeeting}>
        <div className={styles.scheduledMeetingTitle}>
          <img src={icons.alarm.default} alt="알림 아이콘" />
          <div>예약된 회의 목록</div>
        </div>
        <div className={styles.scheduledMeetingList}>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index}>{notification.message}</div>
            ))
          ) : (
            <div>예약된 회의가 없습니다</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeList;

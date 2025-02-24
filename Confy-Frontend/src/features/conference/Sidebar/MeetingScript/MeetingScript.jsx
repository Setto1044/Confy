import React, { useState, useRef, useEffect } from "react";
import { fetchScript } from "../../openvidu/api/meetingScriptApi";
import { BeatLoader } from "react-spinners";
import styles from "./MeetingScript.module.css";

const MeetingScript = ({ meetingId, sttResults }) => {
  const [scriptData, setScriptData] = useState([]);
  const scrollContainerRef = useRef(null);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const koreanTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const hours = koreanTime.getHours();
    const minutes = koreanTime.getMinutes().toString().padStart(2, "0");
    const seconds = koreanTime.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "오후" : "오전";
    const displayHours = hours % 12 || 12;
    return `${ampm} ${displayHours}:${minutes}:${seconds}`;
  };

  // ✅ 서버 데이터 가져오기 (1초마다 실행)
  useEffect(() => {
    if (!meetingId) return;

    const fetchScriptPeriodically = async () => {
      const serverScript = await fetchScript(meetingId);
      if (serverScript.length > 0) {
        setScriptData((prev) => {
          const prevSet = new Set(prev.map((item) => JSON.stringify(item))); // 기존 데이터 Set 변환
          const newData = serverScript.filter(
            (serverItem) => !prevSet.has(JSON.stringify(serverItem)) // 중복 필터링
          );
          return [...prev, ...newData];
        });
      }
    };

    const interval = setInterval(fetchScriptPeriodically, 1000);
    return () => clearInterval(interval);
  }, [meetingId]);

  // ✅ STT 데이터 업데이트 (중복 방지)
  // useEffect(() => {
  //   if (!Array.isArray(sttResults) || sttResults.length === 0) return;

  //   setScriptData((prev) => {
  //     const prevSet = new Set(prev.map((item) => JSON.stringify(item))); // 기존 데이터 Set 변환
  //     const newData = sttResults.filter(
  //       (newItem) => !prevSet.has(JSON.stringify(newItem)) // 중복 필터링
  //     );
  //     return [...prev, ...newData];
  //   });
  // }, [sttResults]);

  // ✅ 스크립트 업데이트 시 자동 스크롤
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [scriptData]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>회의 스크립트</h2>
      <div ref={scrollContainerRef}>
        {scriptData.length === 0 ? (
          <div className={styles.loaderWrapper}>
            <BeatLoader color="#2172F6" size={15} speedMultiplier={0.8} />
          </div>
        ) : (
          scriptData.map((script, index) => (
            <div className={styles.sttData} key={index}>
              <div className={styles.speaker}>{script.speaker}</div>
              <div className={styles.content}>{script.content}</div>
              <div className={styles.time}>{formatTime(script.timestamp)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MeetingScript;

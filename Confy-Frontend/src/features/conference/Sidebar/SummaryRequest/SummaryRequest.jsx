import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./SummaryRequest.module.css";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { fetchMeetingSummary } from "../../openvidu/api/summaryMeetingApi";
import { useSelector } from "react-redux";

const SummaryRequest = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const meetingId = useSelector((state) => state.meetingId?.meetingId);

  useEffect(() => {
    const interval = setInterval(() => {
      setMeetingDuration((prev) => prev + 1); // ✅ 1분마다 1 증가
    }, 60000);

    return () => clearInterval(interval); // ✅ 컴포넌트 언마운트 시 정리
  }, []);

  const requestSummary = async (startMinutesAgo, endMinutesAgo) => {
    if (!meetingId) {
      toast.info("회의 ID를 찾을 수 없습니다.");
      return;
    }

    // ✅ 빈 값만 검사 (0은 유효한 값으로 인정)
    if (startMinutesAgo === "" || endMinutesAgo === "") {
      toast.info("시간을 입력하세요");
      return;
    }

    // ✅ 숫자로 변환 후 비교
    if (Number(startMinutesAgo) <= Number(endMinutesAgo)) {
      toast.info("시작 시간이 종료 시간보다 커야 합니다.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const summaryData = await fetchMeetingSummary(
        meetingId,
        startMinutesAgo.toString(), // ✅ 문자열 변환
        endMinutesAgo.toString() // ✅ 문자열 변환
      );
      setSummary(summaryData);
    } catch (err) {
      setError("요약 요청 실패: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>회의 요약 요청</h2>
      <div className={styles.summaryContainer}>
        <div className={styles.summaryContent}>
          {loading && (
            <div className={styles.loaderWrapper}>
              <BeatLoader color="#2172F6" size={15} speedMultiplier={0.8} />
            </div>
          )}
          {error && <p className={styles.error}>{error}</p>}
          {summary && (
            <div className={styles.summaryBox}>
              <ReactMarkdown className={styles.summaryText}>
                {summary}
              </ReactMarkdown>
              <span className={styles.timestamp}>
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        <div className={styles.buttonList}>
          <div className={styles.buttonGrid}>
            <button
              className={styles.timeButton}
              onClick={() => requestSummary(5, 0)}
            >
              5분 전 요약
            </button>
            <button
              className={styles.timeButton}
              onClick={() => requestSummary(10, 0)}
            >
              10분 전 요약
            </button>
            <button
              className={styles.timeButton}
              onClick={() => requestSummary(30, 0)}
            >
              30분 전 요약
            </button>
            <button
              className={styles.timeButton}
              onClick={() => requestSummary(60, 0)}
            >
              전체 요약
            </button>
          </div>

          <div className={styles.meetingTimeBox}>
            <p className={styles.timeLabel}>
              회의 진행 시간{" "}
              <span className={styles.timeValue}>{meetingDuration}분</span>
            </p>
            <div className={styles.timeInputWrapper}>
              <input
                type="number"
                className={styles.timeInput}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <span className={styles.timeText}>분전 ~</span>
              <input
                type="number"
                className={styles.timeInput}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              <span className={styles.timeText}>분전</span>
            </div>
          </div>
          <div className={styles.requestButton}>
            <button onClick={() => requestSummary(startTime, endTime)}>
              요약 요청
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryRequest;

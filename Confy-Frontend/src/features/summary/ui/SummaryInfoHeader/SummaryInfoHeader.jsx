import styles from "./SummaryInfoHeader.module.css";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchParticipants } from "../../api/summaryApi";

const SummaryInfoHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { meetingId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [renderKey, setRenderKey] = useState(0);
  const meeting = useSelector((state) => state.meetingInfo.meeting); // ✅ Redux에서 meeting 데이터 가져오기

  useEffect(() => {
    // ✅ URL 경로가 변경될 때마다 강제 리렌더링
    setRenderKey((prev) => prev + 1);
  }, [location.pathname]); // ✅ 경로(path)가 변경될 때만 실행

  if (!meeting) return <p>❌ 회의 정보가 없습니다.</p>;

  // ✅ 날짜 변환 함수
  const formatDate = (dateTime) => {
    if (!dateTime) return "날짜 없음";
    const date = new Date(dateTime);
    date.setHours(date.getHours() + 9); // ✅ 한국 시간(UTC+9) 적용
    return date.toISOString().slice(0, 16).replace("T", " ");
  };

  useEffect(() => {
    // ✅ 참가자 정보 불러오기
    const getParticipants = async () => {
      try {
        if (meetingId) {
          const data = await fetchParticipants(meetingId);
          setParticipants(data || []);
        }
      } catch (error) {
        console.error("❌ Error fetching participants:", error);
      }
    };

    getParticipants();
  }, [meetingId]);

  // ✅ `/main` 페이지로 이동하는 함수
  const handleGroupClick = () => {
    navigate("/main"); // ✅ /main 페이지로 이동
  };

  return (
    <div
      key={renderKey}
      className={styles.summaryInfoHeader}
      onClick={handleGroupClick}
    >
      <div className={styles.firstHeader} style={{ cursor: "pointer" }}>
        <div>{meeting.groupName || "그룹 없음"}</div> |
        <div>{meeting.meetingName || "제목 없음"}</div>
      </div>
      <div className={styles.secondHeader}>
        <div>{formatDate(meeting.startedAt)}</div>
        <div>
          {participants.length > 0
            ? participants.join(", ")
            : "참여자 정보 없음"}
        </div>
      </div>
    </div>
  );
};

export default SummaryInfoHeader;

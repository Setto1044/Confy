import React, { useState } from "react";
import styles from "../Sidebar/Sidebar.module.css";
import Participants from "./Participants/Participants";
import SummaryRequest from "./SummaryRequest/SummaryRequest";
import MeetingScript from "./MeetingScript/MeetingScript";
import MeetingLink from "./MeetingLink/MeetingLink";
import { getParticipantsList } from "../openvidu/api/getParticipantsList";
import { useSelector } from "react-redux";

// 아이콘
import UserRegularIcon from "../../../assets/icons/user-regular.svg";
import UserSoildOnlyIcon from "../../../assets/icons/user-solid-only.svg";
import ChatRegular from "../../../assets/icons/chat-regular.svg";
import ChatSolid from "../../../assets/icons/chat-solid.svg";
import DocumentSignedSolid from "../../../assets/icons/document-signed-solid.svg";
import DocumentSigned from "../../../assets/icons/document-signed.svg";
import CloneSolid from "../../../assets/icons/clone-solid.svg";
import CloneRegular from "../../../assets/icons/clone-regular.svg";

const Sidebar = ({ onSidebarToggle, sttResults }) => {
  const meetingId = useSelector((state) => state.meetingId.meetingId); // Redux에서 meetingId 가져오기

  const [activeTab, setActiveTab] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [participantsList, setParticipantsList] = useState([]); // 참여자 목록 상태 추가
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  // ✅ 참여자 목록 API 요청 함수
  const fetchParticipants = async () => {
    if (!meetingId) {
      // console.error("🚨 meetingId가 없습니다. API 요청 취소");
      return;
    }

    // ✅ 이미 로딩 중이면 요청하지 않음
    if (loading) {
      // console.warn("🚨 현재 참여자 목록을 불러오는 중입니다. 중복 요청 방지");
      return;
    }

    try {
      // console.log("🔹 API 요청 시작: ", `/meetings/room/${meetingId}/speakers`);
      setLoading(true);

      const speakers = await getParticipantsList(meetingId); // API 호출
      // console.log("✅ 참여자 목록 응답 데이터: ", speakers);

      setParticipantsList(speakers);
      setError(null);
    } catch (err) {
      console.error("❌ 참여자 목록 조회 실패:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 탭 클릭 핸들러 수정 (참여자 목록 조회 추가)
  const handleTabClick = async (tab) => {
    if (activeTab === tab) {
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);
      if (!newIsOpen) {
        setActiveTab(null);
      }
      onSidebarToggle(newIsOpen);
    } else {
      setActiveTab(tab);
      setIsOpen(true);
      onSidebarToggle(true);

      // ✅ "참여자 목록" 클릭 시, 데이터가 없을 때만 API 요청 실행
      if (tab === "participants" && participantsList.length === 0) {
        await fetchParticipants();
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* 컨텐츠 패널 */}
      {isOpen && (
        <div className={styles.contentPanel}>
          {activeTab === "participants" && (
            <Participants
              participants={participantsList}
              loading={loading}
              error={error}
            />
          )}
          {activeTab === "summary" && <SummaryRequest />}
          {activeTab === "script" && (
            <MeetingScript meetingId={meetingId} sttResults={sttResults} />
          )}
          {activeTab === "link" && <MeetingLink />}
        </div>
      )}

      {/* 사이드바 버튼 */}
      <div className={styles.sidebar}>
        <button
          className={`${styles.button} ${
            activeTab === "participants" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("participants")} // ✅ 버튼 클릭 시 API 요청 추가
        >
          <img
            src={
              activeTab === "participants" && isOpen
                ? UserSoildOnlyIcon
                : UserRegularIcon
            }
            alt="참여자 아이콘"
            className={styles.icon}
          />
        </button>
        <button
          className={`${styles.button} ${
            activeTab === "script" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("script")}
        >
          <img
            src={
              activeTab === "script" && isOpen
                ? DocumentSignedSolid
                : DocumentSigned
            }
            alt="회의 스크립트 아이콘"
            className={styles.icon}
          />
        </button>
        <button
          className={`${styles.button} ${
            activeTab === "summary" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("summary")}
        >
          <img
            src={activeTab === "summary" && isOpen ? ChatSolid : ChatRegular}
            alt="회의 요약 아이콘"
            className={styles.icon}
          />
        </button>
        <button
          className={`${styles.button} ${
            activeTab === "link" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("link")}
        >
          <img
            src={activeTab === "link" && isOpen ? CloneSolid : CloneRegular}
            alt="회의 링크 공유 아이콘"
            className={styles.icon}
          />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

import React from "react";
import styles from "./Participants.module.css";
import ParticipantItem from "./ParticipantItem"; // 개별 참여자 컴포넌트

const Participants = ({ participants, loading, error }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>참여자 ({participants.length})</h2>

      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p className={styles.error}>❌ {error}</p>
      ) : (
        <div className={styles.list}>
          {participants.length === 0 ? (
            <p>현재 참여자가 없습니다.</p> // ✅ 빈 배열일 경우 메시지 표시
          ) : (
            participants.map((participant, index) => (
              <ParticipantItem key={index} data={{ name: participant }} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Participants;

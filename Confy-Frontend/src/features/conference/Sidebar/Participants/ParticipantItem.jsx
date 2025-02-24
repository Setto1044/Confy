// src/components/ParticipantItem.jsx
import React from "react";
import styles from "./ParticipantItem.module.css";

const ParticipantItem = ({ data = {} }) => {
  // ✅ 데이터가 없을 경우 기본값 설정
  const participantName = data?.name ?? "이름 없음";

  // ✅ 프로필 이미지 로직
  const profileImage = data?.profileUrl // 데이터에 프로필 이미지가 있으면 사용
    ? data.profileUrl
    : `/assets/images/default-profile.png`; // 없으면 기본 프로필 사용

  return (
    <div className={styles.participant}>
      <img src={profileImage} alt="프로필" className={styles.avatar} />
      <span className={styles.name}>{participantName}</span>
    </div>
  );
};

export default ParticipantItem;

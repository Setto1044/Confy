import React from "react";
import styles from "../GroupMember/GroupMemberItem.module.css";

function GroupMemberItem({ name, email, role, profileImg }) {
  const defaultProfileImage = "/assets/images/default-profile.png";
  const handleImageError = (event) => {
    event.target.onerror = null;
    event.target.src = defaultProfileImage;
  };

  return (
    <div className={styles.groupMemberItem}>
      <div className={styles.member}>
        <img
          src={profileImg || "https://via.placeholder.com/50"} // 기본 이미지 추가
          alt="Profile"
          className={styles.profileImg}
          onError={handleImageError}
        />
        <div>
          <div>{name}</div>
          <div className={styles.email}>{email}</div>
        </div>
      </div>
      <div>{role}</div>
    </div>
  );
}

export default GroupMemberItem;

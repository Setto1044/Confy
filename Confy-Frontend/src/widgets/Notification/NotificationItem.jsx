import React from "react";
import styles from "../Notification/NotificationItem.module.css";

const NotificationItem = ({
  user = "알림",
  action = "",
  time = "",
  onClick = () => {},
}) => {
  console.log("🔔 렌더링되는 알림:", user, action, time); // ✅ 알림 정보 확인용 로그 추가

  return (
    <div
      className={styles.notificationItem}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <img
        src="https://randomuser.me/api/portraits/men/79.jpg"
        alt="User"
        className={styles.profileImg}
      />
      <div className={styles.content}>
        <div className={styles.notification}>
          <strong>{user}</strong> {action}
        </div>
        <div className={styles.time}>{time}</div>
      </div>
    </div>
  );
};

export default NotificationItem;

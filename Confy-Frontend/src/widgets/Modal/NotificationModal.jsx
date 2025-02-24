import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationItem from "../Notification/NotificationItem";
import styles from "../Modal/style/NotificationModal.module.css";
import useNotifications from "../../shared/hooks/useNotifications";
import icons from "../../shared/icons";

function NotificationModal({ isOpen, onClose, buttonRef }) {
  const [position, setPosition] = useState({ top: 0, right: 0, width: 0 });

  const userId = localStorage.getItem("userId");
  const notifications = useNotifications(userId);

  // 하루가 지난 알림을 제외하는 필터링
  const filteredNotifications = useMemo(() => {
    const now = new Date();
    return notifications.filter((notification) => {
      const createdAt = new Date(notification.createdAt);
      const timeDifference = now - createdAt;
      return timeDifference <= 24 * 60 * 60 * 1000; // 24시간 이내의 알림만 유지
    });
  }, [notifications]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8, // 버튼 아래 위치
        right: window.innerWidth - rect.right, // 버튼 오른쪽 끝에 정렬
        width: 400,
      });
    }
  }, [isOpen, buttonRef]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="absolute bg-white shadow-lg border rounded-[8px] p-[20px]"
      style={{
        position: "absolute",
        top: `${position.top}px`,
        right: `${position.right}px`, // 오른쪽 끝 정렬
        width: `${position.width}px`,
      }}
    >
      <div className={styles.list}>
        <h2 className={styles.header}>알림</h2>
        <div className={styles.content}>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => (
              <div key={index}>{notification.message}</div>
            ))
          ) : (
            <p className={styles.empty}>최근 24시간 내 알림이 없습니다.</p>
          )}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

export default NotificationModal;

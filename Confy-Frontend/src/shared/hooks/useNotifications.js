import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import notificationClient from "../api/apiClient/notificationClient";

const useNotifications = (userId) => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationClient.get("/notifications/users");
        setNotifications(response.data); // ✅ 상태에 직접 저장
      } catch (error) {
        console.error("❌ 알림 조회 실패:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  return notifications;
};

export default useNotifications;

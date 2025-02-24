import { useEffect, useState } from "react";
import homeListApi from "../api/homeListApi";

const useHomeList = () => {
  const [scheduledMeetings, setScheduledMeetings] = useState([]);

  useEffect(() => {
    const fetchScheduledMeetings = async () => {
      try {
        const response = await homeListApi.get(
          "/notifications/scheduled-meetings"
        );
        setScheduledMeetings(response.data);
      } catch (error) {
        console.error("❌ 예약된 회의 조회 실패:", error);
      }
    };

    fetchScheduledMeetings();
    const interval = setInterval(fetchScheduledMeetings, 60000);
    return () => clearInterval(interval);
  }, []);

  return scheduledMeetings;
};

export default useHomeList;

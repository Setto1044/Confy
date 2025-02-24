import React, { useEffect, useState } from "react";
import style from "../../Modal/ProfileModal/style/ProfileModal.module.css";
import Toggle from "../../Toggle/Toggle";
import icons from "../../../shared/icons/index";
import authApi from "../../../shared/api/authApi";

function AlarmTab({ user, onClose }) {
  const [isPushEnabled, setIsPushEnabled] = useState(null);

  // ✅ 1. 기존 알림 설정 가져오기 (초기 로드 시)
  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await authApi.getUserInfo();
      if (response.success) {
        setIsPushEnabled(response.data.isMeetingAlertOn ?? false);
      }
    };
    fetchUserInfo();
  }, []);

  // ✅ 2. 토글 변경 핸들러
  const handleToggleChange = async () => {
    const newState = !isPushEnabled;
    setIsPushEnabled(newState);

    // ✅ 3. API 호출하여 변경된 상태를 서버에 저장
    const response = await authApi.updateMeetingNotification(newState);
    if (!response.success) {
      alert("알림 설정 변경에 실패했습니다.");
      setIsPushEnabled(!newState); // 실패 시 이전 상태로 롤백
    }
  };

  return (
    <div className={style.main}>
      <div className={style.mainTitle}>
        알림 설정
        <div>
          <button onClick={onClose}>
            <img src={icons.cross.default} alt="close" />
          </button>
        </div>
      </div>
      <div className={style.mainList}>
        <div className={style.mainListTitle}>회의 시작 알림</div>
        <div className={style.subtext}>회의가 시작되면 알려드려요</div>
        <div className={style.alarm}>
          <label>푸시 알림 </label>
          {isPushEnabled !== null && ( // ✅ null 체크 후 렌더링
            <Toggle isChecked={isPushEnabled} onChange={handleToggleChange} />
          )}
        </div>
      </div>
    </div>
  );
}
export default AlarmTab;

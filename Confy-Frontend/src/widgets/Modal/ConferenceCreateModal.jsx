import React from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
// import { useCameraStream } from "../../shared/hooks/useCameraStream";
import { useConferenceForm } from "../../shared/hooks/useConferenceForm";
import Button from "../Button/Button";
import styles from "../Modal/style/ConferenceCreateModal.module.css";

function ConferenceCreateModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  // const videoRef = useCameraStream(isOpen);
  const { formData, groups, handleChange } = useConferenceForm(isOpen);
  const handleCreateMeeting = async () => {
    if (!formData.title) {
      alert("회의 제목을 입력해주세요.");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");

      // 입력된 날짜를 UTC로 변환한 후, 9시간을 더해서 KST로 변경
      const dateTimeKST = new Date(formData.dateTime);
      dateTimeKST.setHours(dateTimeKST.getHours() + 9); // UTC+9 (KST)
    
      // 변환된 시간을 ISO 형식으로 변환 (초 단위까지 포함, Z(UTC) 제거)
      const formattedDateTime = dateTimeKST.toISOString().slice(0, 19);
    
      const response = await fetch(
        import.meta.env.VITE_APPLICATION_SERVER_URL + "/meetings/room/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            meetingName: formData.title,
            startedAt: formattedDateTime, // 한국 시간으로 변환된 값 사용
            groupId: formData.groupId,
            visualType: formData.visualization,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create meeting");
      }

      const data = await response.json();
      const newUUID = data.data.uuid;
      navigate(`/meetings/room?UUID=${newUUID}`);
    } catch (error) {
      alert("회의 생성에 실패했습니다.");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className={styles.modal}>
          <div className={styles.main}>
            <h2>새 회의 생성</h2>
            <div className={styles.mainInfo}>
              <h2>회의 설정</h2>
              <div className={styles.inputField}>
                <div className={styles.input}>
                  <label>회의 제목</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="회의 제목 입력"
                  />
                </div>
                <div className={styles.input}>
                  <label>날짜 및 시간</label>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.input}>
                  <label>그룹</label>
                  <select
                    name="groupId"
                    value={formData.groupId}
                    onChange={handleChange}
                  >
                    {groups.length > 0 ? (
                      <>
                        <option value="" disabled>
                          그룹명 선택
                        </option>
                        {groups.map((group) => (
                          <option key={group.id} value={String(group.id)}>
                            {group.groupName}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option disabled>소속된 그룹이 없습니다.</option>
                    )}
                  </select>
                </div>
                <div className={styles.input}>
                  <label>시각화 유형</label>
                  <div className={styles.visualization}>
                    {["Tree", "Bubble", "Fishbone"].map((type) => (
                      <div key={type}>
                        <input
                          type="radio"
                          name="visualization"
                          value={type}
                          checked={formData.visualization === type}
                          onChange={handleChange}
                        />
                        <div>{type}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.mainButtons}>
              <Button text="취소" onClick={onClose} variant="secondary">
                취소
              </Button>
              <Button
                text="생성하기"
                variant="primary"
                onClick={handleCreateMeeting}
              >
                생성하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal-root")
  );
}

export default ConferenceCreateModal;

import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { useConferenceForm } from "../../shared/hooks/useConferenceForm";
import Button from "../Button/Button";
import icons from "../../shared/icons/index";
import styles from "../Modal/style/ConferenceReserveModal.module.css";
import { useDispatch } from "react-redux";

function ConferenceReserveModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formData, groups, handleChange } = useConferenceForm(isOpen);

  const [isReserved, setIsReserved] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");

  const handleReserveMeeting = async () => {
    if (!formData.title) {
      alert("회의 제목을 입력해주세요.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      // 입력된 날짜를 UTC로 변환한 후, 9시간을 더해서 KST로 변경
      const dateTimeKST = new Date(formData.dateTime);
      dateTimeKST.setHours(dateTimeKST.getHours() + 9);

      // 변환된 시간을 ISO 형식으로 변환
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
            startedAt: formattedDateTime,
            groupId: formData.groupId,
            visualType: formData.visualization,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("회의 예약 실패");
      }

      const data = await response.json();
      const newUUID = data.data.uuid;

      setMeetingLink(`${window.location.origin}/meetings/room?UUID=${newUUID}`);
      setIsReserved(true);

      // ✅ 서버에 알림 등록 요청
      await fetch(
        import.meta.env.VITE_APPLICATION_SERVER_URL + "/notifications/users",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      alert("회의 예약에 실패했습니다.");
      console.error(error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    alert("회의 링크가 복사되었습니다!");
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      {/* 🔹 모달 배경 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* 🔹 모달 창 */}
      <div className="fixed inset-0 flex items-center justify-center min-h-screen z-50">
        <div className={styles.modal}>
          {/* ✅ 회의 예약 입력 단계 */}
          {!isReserved ? (
            <div className={styles.main}>
              <h2>새 회의 예약</h2>
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

              {/* 버튼 영역 */}
              <div className={styles.mainButtons}>
                <Button text="취소" onClick={onClose} variant="secondary">
                  취소
                </Button>
                <Button
                  text="생성하기"
                  variant="primary"
                  onClick={handleReserveMeeting}
                >
                  생성하기
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.main}>
              {/* ✅ 회의 예약 완료 단계 */}
              <h2>
                <img src={icons.alarm.default} alt="alarm" />새 회의 예약 완료
              </h2>
              <div className={styles.mainInfo}>
                <h2>회의 설정</h2>

                {/* 링크 복사 영역 */}
                <div className={styles.meetingLink}>
                  <div>참여 정보</div>
                  <div className={styles.subtext}>
                    회의에 참여하기를 원하는 다른 사용자와 이 회의 링크를
                    공유하세요
                  </div>
                  <div className={styles.inputField}>
                    <div className={styles.inputLink}>
                      <input type="text" value={meetingLink} readOnly />
                      <img src={icons.clone.default} onClick={handleCopyLink} />
                    </div>
                  </div>
                </div>
                <div className={styles.mainButtons}>
                  <Button text="확인" onClick={onClose} variant="primary">
                    확인
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>,
    document.getElementById("modal-root")
  );
}

export default ConferenceReserveModal;

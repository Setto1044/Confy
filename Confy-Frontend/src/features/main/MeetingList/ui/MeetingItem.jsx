import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MeetingItem.module.css";
import icons from "../../../../shared/icons/index.js";

// ✅ 마크다운에서 순수 텍스트만 추출하는 함수 (null 안전 처리 추가)
const extractPlainText = (markdown) => {
  if (!markdown) return ""; // null 또는 undefined면 빈 문자열 반환
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = markdown
    .replace(/[#*_>`-]/g, " ") // 마크다운 기호 제거
    .replace(/\n/g, " "); // 줄바꿈을 공백으로 변환
  return tempDiv.textContent || tempDiv.innerText || ""; // 텍스트만 반환
};

const MeetingItem = ({
  meeting,
  onCheck,
  onStar,
  isChecked,
  isStarred,
  viewType,
}) => {
  const navigate = useNavigate();

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onCheck(meeting.id, !isChecked);
  };

  const handleStarClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onStar(meeting.id, !isStarred);
  };

  const handleItemClick = () => {
    navigate(`/meetings/${meeting.id}/summary`, { state: { meeting } });
  };

  return (
    <div
      className={`${
        viewType === "gallery" ? styles.galleryItem : styles.list
      } ${isChecked ? styles.checkedBackground : ""}`}
      onClick={handleItemClick}
    >
      {/* ✅ 체크박스 및 즐겨찾기 아이콘 */}
      <div className={styles.listIcon}>
        <img
          src={isChecked ? icons.checkbox.active : icons.checkbox.default}
          alt="checkbox"
          onClick={handleCheckboxClick}
          className={`${styles.clickableIcon} ${
            isChecked ? styles.alwaysVisible : ""
          }`}
        />
        <img
          src={isStarred ? icons.star.color : icons.star.grey}
          alt="star"
          onClick={handleStarClick}
          className={`${styles.clickableIcon} ${
            isStarred ? styles.alwaysVisible : ""
          }`}
        />
      </div>
      <div className={styles.listTitle}>
        <div>{meeting.meetingName}</div>
        {/* ✅ 마크다운 제거 + 최대 50자까지만 표시 */}
        <div className={styles.listSummary}>
          {extractPlainText(meeting.textSummary).slice(0, 50)}
          {extractPlainText(meeting.textSummary).length > 50 ? "..." : ""}
        </div>
      </div>
      <div className={styles.listGroup}>{meeting.groupName}</div>
      <div className={styles.listDate}>
        {new Date(meeting.startedAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default MeetingItem;

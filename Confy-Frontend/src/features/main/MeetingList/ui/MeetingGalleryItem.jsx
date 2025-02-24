import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MeetingGallery.module.css";
import icons from "../../../../shared/icons/index.js";
import defaultThumbnail from "../../../../assets/images/gallery-thumbnail.png";
import { useSelector } from "react-redux";
//
import thumbnail1 from "../../../../assets/images/gallery-thumbnail1.png";
import thumbnail2 from "../../../../assets/images/gallery-thumbnail2.png";
import thumbnail3 from "../../../../assets/images/gallery-thumbnail3.png";
import thumbnail4 from "../../../../assets/images/gallery-thumbnail4.png";
import thumbnail5 from "../../../../assets/images/gallery-thumbnail5.png";
//

const thumbnails = [thumbnail1, thumbnail2, thumbnail3, thumbnail4, thumbnail5];

const getRandomThumbnail = () => {
  return thumbnails[Math.floor(Math.random() * thumbnails.length)];
};

const MeetingGalleryItem = ({
  meeting,
  isChecked,
  isStarred,
  onCheck,
  onStar,
  loadedImages,
  errorImages,
}) => {
  const navigate = useNavigate();

  const updatedImagePath = useSelector((state) => {
    console.log("📌 Redux에서 가져온 meeting 상태:", state.meeting.meetings); // ✅ Redux 전체 meetings 로그
    const updatedMeeting = state.meeting.meetings.find(
      (m) => m.id === meeting.id
    );
    console.log("📌 찾은 meeting 데이터:", updatedMeeting); // ✅ 개별 meeting 로그
    return updatedMeeting?.summaryImagePath || null;
  });

  // ✅ 강제 리렌더링을 위한 상태
  const initialThumbnail = updatedImagePath || getRandomThumbnail();
  const [thumbnail, setThumbnail] = useState(initialThumbnail);

  useEffect(() => {
    if (updatedImagePath) {
      setThumbnail(updatedImagePath);
    } else {
      setThumbnail(getRandomThumbnail()); // ✅ Redux에서 이미지가 없으면 랜덤 썸네일 적용
    }
  }, [updatedImagePath]);

  // ✅ Redux 상태가 변경되었을 때 강제 리렌더링 (수동 이벤트 리스너)
  useEffect(() => {
    const updateThumbnail = () => setThumbnail(updatedImagePath || getRandomThumbnail());
    window.addEventListener("thumbnailUpdated", updateThumbnail);
    return () => {
      window.removeEventListener("thumbnailUpdated", updateThumbnail);
    };
  }, [updatedImagePath]);

  const handleStarClick = (e) => {
    e.stopPropagation(); // ✅ 이벤트 버블링 방지
    onStar(meeting.id, !isStarred);
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation(); // ✅ 이벤트 버블링 방지
    onCheck(meeting.id, !isChecked);
  };

  const handleItemClick = () => {
    navigate(`/meetings/${meeting.id}/summary`, { state: { meeting } });
  };

  // 이미지 로드 실패 시, 랜덤 이미지로 대체
  const handleImageError = (event) => {
    event.target.src = getRandomThumbnail();
  };

  

  return (
    <div
      className={`${styles.galleryItem} ${
        isChecked ? styles.checkedBackground : ""
      }`}
      onClick={handleItemClick}
    >
      <div className={styles.imageContainer}>
        <img
          src={thumbnail && thumbnail.startsWith("data:image") ? thumbnail : thumbnail || defaultThumbnail} // ✅ Base64인지 확인 후 반영
          alt="thumbnail"
          onError={handleImageError}
        />
        <div className={styles.overlay}>
          <div className={styles.iconContainer}>
            <img
              src={isChecked ? icons.checkbox.active : icons.checkbox.default}
              alt="checkbox"
              onClick={handleCheckboxClick}
              className={`${styles.icon} ${isChecked ? styles.visible : ""}`}
            />
            <img
              src={isStarred ? icons.star.color : icons.star.grey}
              alt="star"
              onClick={handleStarClick}
              className={`${styles.icon} ${isStarred ? styles.visible : ""}`}
            />
          </div>
        </div>
      </div>

      <div className={styles.meetingInfo}>
        <div className={styles.meetingTitle}>{meeting.meetingName}</div>{" "}
        {/* ✅ 올바른 필드 사용 */}
        <div className={styles.meetingDetails}>
          <div className={styles.meetingDate}>
            {new Date(meeting.startedAt).toLocaleString()} {/* ✅ 날짜 변환 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MeetingGalleryItem);

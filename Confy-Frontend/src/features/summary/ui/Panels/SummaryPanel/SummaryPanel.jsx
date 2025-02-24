import ReactMarkdown from "react-markdown";
import { BeatLoader } from "react-spinners";
import styles from "./SummaryPanel.module.css";
import Button from "../../../../../widgets/Button/Button";
import { useEffect, useRef, useState } from "react";
import { updateSummary, enterEditMode } from "../../../api/summaryApi";

const SummaryPanel = ({ summaryData, refetchSummary, meetingId }) => {
  const summaryRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedSummary, setEditedSummary] = useState(summaryData || "");
  const [isScrolledTop, setIsScrolledTop] = useState(false);
  const [isScrolledBottom, setIsScrolledBottom] = useState(false);

  useEffect(() => {
    setEditedSummary(summaryData || ""); // 요약 데이터가 변경될 때 수정된 내용 초기화
  }, [summaryData]);

  useEffect(() => {
    const handleScroll = () => {
      if (!summaryRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = summaryRef.current;

      setIsScrolledTop(scrollTop > 0);
      setIsScrolledBottom(scrollTop + clientHeight >= scrollHeight);
    };

    const element = summaryRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      handleScroll(); // 초기 상태 체크
    }

    return () => {
      if (element) {
        element.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // ✅ '수정' 버튼 클릭 시 편집 모드 활성화
  const handleEdit = async () => {
    try {
      const response = await enterEditMode(meetingId);
      if (response.success) {
        setIsEditMode(true);
        setEditedSummary(summaryData); // 기존 요약 데이터를 수정 상태로 복사
      }
    } catch (error) {
      console.error("❌ Error entering edit mode:", error);
    }
  };

  // ✅ '저장' 버튼 클릭 시 변경된 내용 저장
  const handleSave = async () => {
    try {
      await updateSummary(meetingId, editedSummary);
      setIsEditMode(false);
      refetchSummary(); // 저장 후 데이터 다시 불러오기
    } catch (error) {
      console.error("❌ Error updating summary:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {summaryData === undefined ? (
          <div className="flex flex-col items-center justify-center gap-2 h-full text-center">
            <p className="text-gray-600">요약 데이터를 생성 중입니다...</p>
            <BeatLoader color="#2172F6" size={15} speedMultiplier={0.8} />
          </div>
        ) : isEditMode ? (
          // ✏️ 수정 모드: 텍스트 입력 필드
          <textarea
            className={styles.summaryWrapper}
            value={editedSummary}
            onChange={(e) => setEditedSummary(e.target.value)}
          />
        ) : (
          // 📄 읽기 모드: 마크다운 렌더링
          <div
            ref={summaryRef}
            className={`${styles.summaryWrapper} 
                        ${isScrolledTop ? styles.scrolledTop : ""} 
                        ${isScrolledBottom ? styles.scrolledBottom : ""}`}
          >
            <ReactMarkdown>{summaryData}</ReactMarkdown>
          </div>
        )}
      </div>

      {summaryData !== undefined && (
        <div className={styles.fixedButtonContainer}>
          {isEditMode ? (
            <Button
              className={`${styles.saveButton} text-white px-4 py-2 rounded-lg shadow-lg`}
              onClick={handleSave}
            >
              저장
            </Button>
          ) : (
            <Button
              className={`${styles.editButton} text-white px-4 py-2 rounded-lg shadow-lg`}
              onClick={handleEdit}
            >
              수정
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SummaryPanel;

import React, { useState, useEffect } from "react";
import styles from "./MeetingLink.module.css";
import icons from "../../../../shared/icons/index";
import { toast } from "react-toastify";

const MeetingLink = () => {
  const [copied, setCopied] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");

  // 현재 URL을 meetingLink로 설정
  useEffect(() => {
    setMeetingLink(window.location.href); // 현재 페이지의 URL을 자동으로 설정
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      setCopied(true);
      toast.success("클립보드에 복사되었습니다!");
      setTimeout(() => setCopied(false), 2000); // 2초 후 복사 상태 초기화
    } catch (err) {
      console.error("복사 실패:", err);
      toast.error("❌ 복사에 실패했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>회의 링크 공유</h2>
      <div className={styles.linkWrapper}>
        <div
          className={`${styles.linkContainer} ${copied ? styles.copied : ""}`}
          onClick={copyToClipboard}
        >
          <input
            type="text"
            value={meetingLink}
            readOnly
            className={styles.linkInput}
            aria-label="회의 링크"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard();
            }}
            className={styles.copyButton}
            aria-label="링크 복사하기"
            onMouseEnter={(e) =>
              (e.currentTarget.firstChild.src = icons.clone.active)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.firstChild.src = icons.clone.default)
            }
          >
            <img src={icons.clone.default} alt="복사 아이콘" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingLink;

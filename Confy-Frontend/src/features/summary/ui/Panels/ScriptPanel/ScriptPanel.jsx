import styles from "./ScriptPanel.module.css";
import { formatTimestamp } from "../../../../../shared/lib/formatDate";
import { fetchKeywords } from "../../../api/summaryApi";
import { useState } from "react";
import { useEffect } from "react";

const mergeConsecutiveSpeakers = (scripts) => {
  const mergedScripts = [];
  scripts?.forEach((script) => {
    const lastItem = mergedScripts[mergedScripts.length - 1];
    if (lastItem && lastItem.speaker === script.speaker) {
      lastItem.content += " " + script.content;
    } else {
      mergedScripts.push({ ...script });
    }
  });
  return mergedScripts;
};

const ScriptPanel = ({ meetingId, scriptData }) => {
  const [keywords, setKeywords] = useState([]);
  const mergedScripts = mergeConsecutiveSpeakers(scriptData);

  useEffect(() => {
    if (!meetingId) return;

    const getKeywords = async () => {
      try {
        const keywordList = await fetchKeywords(meetingId);
        setKeywords(keywordList);
      } catch (error) {
        console.error("❌ 키워드 데이터를 불러오지 못했습니다.", error);
      }
    };

    getKeywords();
  }, [meetingId]);

  if (!mergedScripts?.length)
    return (
      <p className="text-gray-600 text-center mt-8 flex items-center justify-center h-99">
        스크립트가 없습니다.
      </p>
    );

  return (
    <div className={styles.container}>
      <div className={styles.scriptListContainer}>
        <div className={styles.keywordList}>
          {keywords.length > 0 ? (
            keywords.map((keyword, index) => (
              <span key={index} className={styles.keyword}>
                # {keyword}
              </span>
            ))
          ) : (
            <p className="text-gray-500">키워드 없음</p>
          )}
        </div>
        <div className={styles.scriptList}>
          {mergedScripts.map((script, index) => (
            <div key={index} className={styles.scriptItem}>
              <div className={styles.speakerInfo}>
                <span className={styles.speakerName}>{script.speaker}</span>
                <span>{formatTimestamp(script.timestamp)}</span>
              </div>
              <p className={styles.content}>{script.content}</p>
            </div>
          ))}
        </div>
        {/* 🔹 스크롤 끝부분 흐림 효과 */}
        <div className={styles.fadeBottom} />
      </div>
    </div>
  );
};

export default ScriptPanel;

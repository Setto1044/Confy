import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../Modal/style/ConferenceStartModal.module.css";
import icons from "../../shared/icons/index";

const ConferenceStartModal = ({
  isOpen,
  onClose,
  buttonRef,
  onStartMeeting,
  onReserveMeeting,
}) => {
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // 🔹 버튼 위치를 기준으로 드롭다운 위치 설정
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4, // 버튼 아래 여백 4px
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen, buttonRef]);

  // 🔹 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={modalRef}
      className={styles.dropdownMenu}
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        minWidth: "160px",
        zIndex: 1000,
      }}
    >
      {/* 회의 시작하기 버튼 */}
      <button
        className={styles.dropdownItem}
        onClick={() => {
          onStartMeeting();
          onClose();
        }}
      >
        <img src={icons.video.grey} alt="Start" />
        <span>회의 시작하기</span>
      </button>

      {/* 회의 예약하기 버튼 */}
      <button
        className={styles.dropdownItem}
        onClick={() => {
          onReserveMeeting();
          onClose();
        }}
      >
        <img src={icons.calendar.default} alt="Reserve" />
        <span>회의 예약하기</span>
      </button>
    </div>,
    document.body // 🔹 body 아래로 이동시켜서 원하는 위치에서 정확하게 표시
  );
};

export default ConferenceStartModal;

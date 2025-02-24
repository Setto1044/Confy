import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useGroups from "../../features/main/Sidebar/hooks/useGroups";
import styles from "../Modal/style/ConferenceStartModal.module.css";
import icons from "../../shared/icons/index";

const GroupListModal = ({
  isOpen,
  onClose,
  buttonRef,
  selectedGroup,
  setEditingGroupId,
}) => {
  const modalRef = useRef(null);
  const { deleteGroup, isLeaving } = useGroups();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen, buttonRef]);

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

  const handleRemoveGroup = async () => {
    if (!selectedGroup) return;
    await deleteGroup(selectedGroup.id); // ✅ 그룹 삭제 요청
    onClose();
  };

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
      <button
        className={styles.dropdownItem}
        onClick={() => {
          setEditingGroupId(selectedGroup.id);
          onClose();
        }}
      >
        <img src={icons.pencil.default} alt="edit" />
        <span>이름 변경하기</span>
      </button>

      <button
        className={styles.dropdownItem}
        onClick={handleRemoveGroup}
        disabled={isLeaving}
      >
        <img src={icons.trashCan.color} alt="trash" />
        <span>{isLeaving ? "삭제 중..." : "삭제하기"}</span>
      </button>
    </div>,
    document.body
  );
};

export default GroupListModal;

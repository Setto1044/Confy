import React from "react";
import styles from "../Button/SidebarButton.module.css";
import icons from "../../shared/icons/index";

const SidebarButton = ({ icon, label, isActive, onClick, onMoreClick }) => {
  return (
    <div className={styles.buttonWrapper}>
      <button
        className={`${styles.sidebarButton} ${isActive ? styles.active : ""}`}
        onClick={onClick}
      >
        {icon && (
          <img
            src={isActive && icon.active ? icon.active : icon.default}
            alt={label}
            className={styles.mainIcon}
          />
        )}
        <span>{label}</span>
        <div className={styles.moreIconWrapper}>
          <img
            src={icons.menuDot.default}
            alt="더보기"
            className={styles.moreIcon}
            onClick={(e) => {
              e.stopPropagation();
              onMoreClick?.(e); // ✅ 클릭 이벤트 전달
            }}
          />
        </div>
      </button>
    </div>
  );
};

export default SidebarButton;

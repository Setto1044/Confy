import React from "react";
import styles from "./SidebarButton.module.css";

const SidebarButton = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      className={`${styles.sidebarButton} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      {icon && (
        <img
          src={isActive && icon.active ? icon.active : icon.default}
          alt={label}
        />
      )}
      <span>{label}</span>
    </button>
  );
};

export default SidebarButton;

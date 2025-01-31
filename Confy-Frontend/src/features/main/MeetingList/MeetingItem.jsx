import React from "react";
import styles from "../MeetingList/MeetingItem.module.css";

const MeetingItem = ({ meeting }) => {
  return (
    <div className={styles.list}>
      <div className={styles.listTitle}>{meeting.title}</div>
      <div className={styles.listGroup}>{meeting.group}</div>
      <div className={styles.listDate}>{meeting.date}</div>
    </div>
  );
};

export default MeetingItem;

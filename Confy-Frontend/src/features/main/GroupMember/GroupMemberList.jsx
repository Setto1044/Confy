import React from "react";
import GroupMemberItem from "./GroupMemberItem";
import styles from "../GroupMember/GroupMemberList.module.css";

function GroupMemberList({ members }) {
  return (
    <div className={styles.groupMemberList}>
      <h2>그룹 멤버</h2>
      {members.length === 0 ? (
        <div className={styles.groupMemberItem}>현재 멤버가 없습니다.</div>
      ) : (
        <div className={styles.groupMemberItem}>
          {members.map((member) => (
            <GroupMemberItem
              key={member.id}
              name={member.fullName}
              email={member.email}
              profileImg={member.profileImg}
              role={member.isLeader ? "Admin" : "Member"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default GroupMemberList;

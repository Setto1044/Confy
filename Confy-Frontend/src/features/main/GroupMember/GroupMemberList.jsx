import React from "react";
import GroupMemberItem from "./GroupMemberItem";

function GroupMemberList({ members }) {
  return (
    <div className="border-t pt-3">
      <h3 className="text-gray-600 text-sm mb-2">그룹 멤버</h3>
      <ul className="divide-y">
        {members.map((member) => (
          <GroupMemberItem key={member.id} name={member.name} email={member.email} role={member.role} />
        ))}
      </ul>
    </div>
  );
}

export default GroupMemberList;

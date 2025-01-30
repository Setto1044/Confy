import React from "react";

function GroupMemberItem({ name, email, role }) {
  return (
    <li className="flex items-center justify-between p-2">
      <div>
        <p className="text-gray-800 font-medium">{name}</p>
        <p className="text-gray-500 text-sm">{email}</p>
      </div>
      <span className={`text-sm font-semibold ${role === "Admin" ? "text-blue-600" : "text-gray-600"}`}>
        {role}
      </span>
    </li>
  );
}

export default GroupMemberItem;

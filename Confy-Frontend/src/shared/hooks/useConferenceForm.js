import { useState, useEffect } from "react";
import { getGroupList } from "../../features/main/Sidebar/api/groupListApi";

export function useConferenceForm(isOpen) {
  function getLocalDateTime() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now - offset).toISOString().slice(0, 16);
  }

  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    displayName: "",
    title: "",
    dateTime: getLocalDateTime(),
    groupId: "",
    visualization: "Tree",
  });

  useEffect(() => {
    async function fetchGroups() {
      try {
        const groupData = await getGroupList();
        setGroups(groupData);
        if (groupData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            groupId: groupData[0].id,
          }));
        }
      } catch (error) {
        console.error("❌ 그룹 목록 불러오기 실패", error);
      }
    }
    if (isOpen) fetchGroups();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return { formData, setFormData, groups, handleChange };
}

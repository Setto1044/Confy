import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGroup } from "../../../shared/store/meetingSlice";
import useGroups from "./hooks/useGroups";
import styles from "../Sidebar/GroupList.module.css";
import SidebarButton from "../../../widgets/Button/SidebarButton";
import GroupListModal from "../../../widgets/Modal/GroupListModal";
import icons from "../../../shared/icons/index";

const GroupList = () => {
  const dispatch = useDispatch();
  const selectedGroup = useSelector((state) => state.meeting.selectedGroup);
  const [groupName, setGroupName] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null); // ✅ 수정 중인 그룹 ID
  const inputRef = useRef(null);

  const {
    groups,
    isLoading,
    error,
    isCreating,
    isUpdating,
    addNewGroup,
    updateGroup,
  } = useGroups();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroupForModal, setSelectedGroupForModal] = useState(null);
  const moreButtonRef = useRef(null);

  const showInput = () => {
    setIsInputVisible(true);
    setTimeout(() => {
      setGroupName("기본 그룹");
      inputRef.current?.focus();
    }, 0);
  };

  const handleAddGroup = async () => {
    if (!groupName.trim()) return;
    await addNewGroup(groupName);
    setGroupName("");
    setIsInputVisible(false);
  };

  // ✅ 그룹 이름 수정 반영
  const handleEditGroup = async (groupId, newName) => {
    if (!newName.trim()) {
      setEditingGroupId(null);
      return;
    }
    await updateGroup(groupId, newName);
    setEditingGroupId(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        handleAddGroup();
      }
    };

    if (isInputVisible) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isInputVisible, groupName]);

  return (
    <div className={styles.groupList}>
      <div className={styles.addGroup}>
        <div>그룹</div>
        <button onClick={showInput}>+</button>
      </div>
      <div className={styles.groupListBox}>
        {groups.map((group) => (
          <div key={group.id} className={styles.groupList}>
            {editingGroupId === group.id ? (
              <input
                ref={inputRef}
                type="text"
                className={styles.inputField}
                defaultValue={group.groupName}
                onBlur={(e) => handleEditGroup(group.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    handleEditGroup(group.id, e.target.value);
                  if (e.key === "Escape") setEditingGroupId(null);
                }}
                autoFocus
              />
            ) : (
              <SidebarButton
                label={group.groupName}
                icon={icons.folder}
                onClick={() => dispatch(setSelectedGroup(group.id))}
                isActive={selectedGroup === group.id}
                onMoreClick={(event) => {
                  event.stopPropagation();
                  setSelectedGroupForModal(group);
                  setModalOpen(true);
                  moreButtonRef.current = event.currentTarget;
                }}
              />
            )}
          </div>
        ))}
      </div>

      {isInputVisible && (
        <input
          ref={inputRef}
          type="text"
          className={styles.inputField}
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          disabled={isCreating}
        />
      )}

      {modalOpen && selectedGroupForModal && (
        <GroupListModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          buttonRef={moreButtonRef}
          selectedGroup={selectedGroupForModal}
          setEditingGroupId={setEditingGroupId}
        />
      )}
    </div>
  );
};

export default GroupList;

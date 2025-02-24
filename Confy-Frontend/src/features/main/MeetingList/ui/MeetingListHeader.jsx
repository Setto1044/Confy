import React, { useState, useRef, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchGroups,
  getGroupMembers,
} from "../../../../shared/store/groupSlice.js";
import ConferenceStartModal from "../../../../widgets/Modal/ConferenceStartModal.jsx";
import ConferenceCreateModal from "../../../../widgets/Modal/ConferenceCreateModal.jsx";
import ConferenceReserveModal from "../../../../widgets/Modal/ConferenceReserveModal.jsx";
import GroupInviteModal from "../../../../widgets/Modal/GroupInviteModal.jsx";
import styles from "./MeetingListHeader.module.css";
import icons from "../../../../shared/icons/index.js";

const MeetingListHeader = ({
  selectedGroup,
  checkedItems = [],
  onDelete,
  viewType,
  setViewType,
}) => {
  const dispatch = useDispatch(); // ✅ dispatch 선언
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConferenceCreateOpen, setIsConferenceCreateOpen] = useState(false);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isReserved, setIsReserved] = useState(false);

  const buttonRef = useRef(null);

  // ✅ Redux에서 그룹 리스트&멤버 가져오기
  const groups = useSelector((state) => state.group.groups) ?? [];
  const members = useSelector((state) => state.group.members) ?? [];

  useEffect(() => {
    if (groups.length === 0) {
      dispatch(fetchGroups());
    }
    if (selectedGroup) {
      dispatch(getGroupMembers(selectedGroup));
    }
  }, [dispatch, groups.length, selectedGroup]);

  // ✅ 선택된 그룹 ID에 해당하는 그룹 이름 찾기
  const selectedGroupName = useMemo(() => {
    if (!selectedGroup) return "회의 목록"; // 그룹이 선택되지 않았을 경우 기본값
    if (!groups.length) return "알 수 없는 그룹"; // ✅ 빈 배열이면 기본값 반환

    const foundGroup = groups.find((group) => group.id === selectedGroup);
    return foundGroup ? foundGroup.groupName : "알 수 없는 그룹";
  }, [selectedGroup, groups]);

  const hasCheckedItems = useMemo(
    () => checkedItems.length > 0,
    [checkedItems]
  );

  return (
    <div>
      <div className={styles.meetingListHeader}>
        <div className={styles.contentHeader}>
          <div className={styles.groupTitle}>
            <div className={styles.groupName}>{selectedGroupName}</div>
            {/* 🔹 그룹 멤버 버튼 */}
            {selectedGroup ? (
              <button
                className={styles.groupMember}
                onClick={() => setIsInviteModalOpen(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <img
                  src={isHovered ? icons.user.active : icons.user.default}
                  alt="list"
                />
                <div>{members.length}</div>
              </button>
            ) : null}
          </div>

          <div ref={buttonRef} className={styles.dropdownContainer}>
            <button
              className={styles.meetingStartBtn}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <img src={icons.video.default} alt="list" />
              <div>회의 시작</div>
            </button>

            <ConferenceStartModal
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
              buttonRef={buttonRef}
              onStartMeeting={() => {
                setIsConferenceCreateOpen(true);
                setIsDropdownOpen(false);
              }}
              onReserveMeeting={() => {
                setIsReserveModalOpen(true);
                setIsDropdownOpen(false);
              }}
            />
          </div>
        </div>

        <div className={styles.listType}>
          <button
            className={`${styles.listTypeBtn} ${
              viewType === "list" ? styles.active : ""
            }`}
            onClick={() => setViewType("list")}
          >
            <img src={icons.listUlSolid} alt="list" />
          </button>
          <button
            className={`${styles.listTypeBtn} ${
              viewType === "gallery" ? styles.active : ""
            }`}
            onClick={() => setViewType("gallery")}
          >
            <img src={icons.menuRegular} alt="gallery" />
          </button>

          {checkedItems.length > 0 && (
            <button className={styles.deleteBtn} onClick={onDelete}>
              <img src={icons.trashCan.color} alt="trash" />
              <div>삭제하기</div>
            </button>
          )}
        </div>
      </div>

      <ConferenceCreateModal
        isOpen={isConferenceCreateOpen}
        onClose={() => setIsConferenceCreateOpen(false)}
      />

      <ConferenceReserveModal
        isOpen={isReserveModalOpen}
        onClose={() => {
          setIsReserveModalOpen(false);
          setIsReserved(false);
        }}
        isReserved={isReserved}
        setIsReserved={setIsReserved}
      />

      <GroupInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        groupId={selectedGroup}
      />
    </div>
  );
};

export default MeetingListHeader;

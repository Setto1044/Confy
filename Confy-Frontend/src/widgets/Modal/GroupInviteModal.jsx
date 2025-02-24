import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import GroupMemberList from "../../features/main/GroupMember/GroupMemberList";
import useGroupMembers from "../../features/main/GroupMember/hooks/useGroupMembers";
import { useSelector } from "react-redux";
import styles from "../Modal/style/GroupInviteModal.module.css";
import icons from "../../shared/icons";
import Input from "../Input/Input";

function GroupInviteModal({ isOpen, onClose, groupId }) {
  const [email, setEmail] = useState("");
  const { members, invite, isLoading } = useGroupMembers(groupId);

  // ✅ 그룹 이름 가져오기
  const groups = useSelector((state) => state.group.groups);
  const selectedGroup = groups.find((group) => group.id === groupId);
  const groupName = selectedGroup ? selectedGroup.groupName : "알 수 없는 그룹";

  // ✅ 이메일 추가 시 즉시 초대
  const handleAddEmail = async () => {
    if (!email.trim()) return;

    try {
      await invite([email]); // ✅ 입력된 이메일 즉시 초대
      setEmail(""); // ✅ 초대 후 입력값 초기화
    } catch (err) {
      console.error("초대 실패:", err);
    }
  };

  // 모달 바깥 클릭 시 닫기
  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  // 멤버 목록 변경 확인
  useEffect(() => {}, [members]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      id="modal-overlay"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleOutsideClick}
    >
      <div
        className={styles.groupInviteModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.list}>
          <div className={styles.header}>
            <img src={icons.user.default} alt="" />
            그룹 멤버 초대
          </div>
          <div className={styles.content}>
            {/* ✅ 그룹 이름 표시 */}
            <p>{groupName}</p>

            {/* ✅ 이메일 입력 및 즉시 초대 */}
            <div className={styles.email}>
              <label>이메일(ID)</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일(ID)"
              />
              <button
                onClick={handleAddEmail}
                disabled={!email.trim() || isLoading}
              >
                {isLoading ? "초대 중..." : "추가"}
              </button>
            </div>

            {/* ✅ 그룹 멤버 목록 */}
            {isLoading ? (
              <div className={styles.content}>로딩 중...</div>
            ) : (
              <>
                <GroupMemberList members={members} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

export default GroupInviteModal;

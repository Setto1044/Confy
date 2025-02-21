import React, { useState } from "react";
import ReactDOM from "react-dom";
import style from "../../Modal/ProfileModal/style/ProfileModal.module.css";
import Logout from "../../../features/main/Profile/Logout";
import AccountTab from "../ProfileModal/AccoutTab";
import AlarmTab from "./AlarmTab";
import InfoTab from "./InfoTab";
import useProfileImage from "../../../shared/hooks/useProfileImage";

function ProfileModal({ isOpen, onClose, user }) {
  const [activeTab, setActiveTab] = useState("account");

  const defaultProfileImage = "/assets/images/default-profile.png";
  const handleImageError = (event) => {
    event.target.onerror = null;
    event.target.src = defaultProfileImage;
  };

  const profileImage = useProfileImage();

  if (!isOpen) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountTab user={user} onClose={onClose} />;
      case "alarm":
        return <AlarmTab user={user} onClose={onClose} />;
      case "info":
        return <InfoTab user={user} onClose={onClose} />;
      default:
        return null;
    }
  };

  return ReactDOM.createPortal(
    <>
      {/* 🔹 모달 배경 */}
      <div
        id="modal-overlay"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={onClose}
      ></div>

      {/* 🔹 모달 창 */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-[856px] h-[560px] flex">
          {/* 🔹 왼쪽 사이드바 */}
          <div className={style.aside}>
            <div className={style.asideProfile}>
              <img
                src={profileImage}
                alt="프로필 이미지"
                onError={handleImageError}
              />
              <div className={style.asideProfileInfo}>
                <div>{user?.fullName || "사용자"}</div>
                <div>{user?.email || "이메일 없음"}</div>
              </div>
            </div>

            {/* 네비게이션 메뉴 */}
            <div className={style.asideNav}>
              <div className={style.asideNavTitle}>계정 및 서비스</div>
              <div className={style.asideNavItemList}>
                <div
                  className={style.asideNavItem}
                  data-active={activeTab === "account"}
                  onClick={() => setActiveTab("account")}
                >
                  내 계정
                </div>
                <div
                  className={style.asideNavItem}
                  data-active={activeTab === "alarm"}
                  onClick={() => setActiveTab("alarm")}
                >
                  알림 설정
                </div>
                <div
                  className={style.asideNavItem}
                  data-active={activeTab === "info"}
                  onClick={() => setActiveTab("info")}
                >
                  서비스 정보
                </div>
              </div>
            </div>

            {/* 로그아웃 */}
            <div className={style.logout}>
              <Logout />
            </div>
          </div>

          {/* 🔹 오른쪽 콘텐츠 영역 */}
          <div>{renderContent()}</div>
        </div>
      </div>
    </>,
    document.getElementById("modal-root")
  );
}

export default ProfileModal;

import React, { useState, useEffect, useRef } from "react";
import NotificationModal from "../Modal/NotificationModal";
import ProfileModal from "../Modal/ProfileModal/ProfileModal";
import SearchBar from "./SearchBar";
import styles from "../Header/MainHeader.module.css";
import icons from "../../shared/icons";
import bellIcon from "../../assets/icons/bell-regular.svg";
import calendarIcon from "../../assets/icons/calendar-regular.svg";
import authApi from "../../shared/api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../shared/store/authSlice";
import { setSearchQuery } from "../../shared/store/meetingSlice";
import useProfileImage from "../../shared/hooks/useProfileImage";

const MainHeader = ({ toggleCalendar, toggleSidebar, isSidebarVisible }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const notificationButtonRef = useRef(null);

  const STATIC_IMAGE_URL = import.meta.env.VITE_STATIC_IMAGE_URL;

  const defaultProfileImage = "/assets/images/default-profile.png";
  const handleImageError = (event) => {
    event.target.onerror = null;
    event.target.src = defaultProfileImage;
  };

  const profileUrl = user?.profileUrl
    ? user.profileUrl.startsWith("http")
      ? user.profileUrl
      : `${STATIC_IMAGE_URL}${user.profileUrl}`
    : "https://i.pravatar.cc/150?img=1";

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await authApi.getUserInfo();

        if (response.success && response.data) {
          dispatch(login(response.data)); // ✅ Redux 상태 업데이트
        }
      } catch (error) {
        console.error("❌ 사용자 정보 불러오기 실패:", error);
      }
    };

    fetchUserInfo();
  }, [dispatch]);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);
  const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);

  const handleSearch = (query) => {
    dispatch(setSearchQuery(query));
  };

  const profileImage = useProfileImage();

  return (
    <div className={styles.mainHeader}>
      {!isSidebarVisible && (
        <button onClick={toggleSidebar}>
          <img src={icons.menu.default} alt="menu" />
        </button>
      )}
      <SearchBar onSearch={handleSearch} />
      <div className={styles.icon}>
        <button onClick={toggleCalendar}>
          <img src={calendarIcon} alt="calendar" />
        </button>

        <button ref={notificationButtonRef} onClick={toggleNotification}>
          <img src={bellIcon} alt="bell" />
        </button>

        {/* ✅ 프로필 이미지 */}
        <img
          src={profileImage}
          alt="Profile"
          onClick={openProfileModal}
          className={styles.profileImg}
          onError={handleImageError}
        />
      </div>

      {isNotificationOpen && (
        <NotificationModal
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          buttonRef={notificationButtonRef}
        />
      )}

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
        user={user}
      />
    </div>
  );
};

export default MainHeader;

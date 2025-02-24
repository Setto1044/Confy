import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilter,
  setSelectedGroup,
  fetchMeetings,
} from "../../../shared/store/meetingSlice";
import GroupList from "./GroupList";
import styles from "../Sidebar/Sidebar.module.css";
import LogoBlack from "../../../assets/svgs/full-logo-gray.svg";
import SidebarButton from "../../../widgets/Button/SidebarButton";
import icons from "../../../shared/icons/index";

const Sidebar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const selectedFilter = useSelector((state) => state.meeting.selectedFilter);

  const handleHomeClick = () => dispatch(setFilter("home"));
  const handleAllClick = () => dispatch(setFilter("all"));
  const handleStarredClick = () => {
    dispatch(setFilter("starred"));
    dispatch(fetchMeetings({ type: "favorite", cursor: null, size: 20 }));
  };
  const handleGroupClick = (groupId) => {
    dispatch(setSelectedGroup(Number(groupId)));
    dispatch(fetchMeetings({ type: "group", groupId, cursor: null, size: 20 }));
  };

  const menuItems = [
    {
      label: "홈",
      value: "home",
      icon: icons.home,
      onClick: handleHomeClick,
    },
    {
      label: "전체 보드",
      value: "all",
      icon: icons.clipboard,
      onClick: handleAllClick,
    },
    {
      label: "즐겨찾기",
      value: "starred",
      icon: icons.star,
      onClick: handleStarredClick,
    },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <img onClick={handleHomeClick} src={LogoBlack} alt="Confy Logo_gray" />
        <button onClick={toggleSidebar}>
          <img src={icons.angleDoubleLeft} alt="toggle" />
        </button>
      </div>
      <div className={styles.contentList}>
        <div className={styles.buttonList}>
          <div className={styles.addGroup}>
            <div>보드</div>
          </div>
          {menuItems.map((item) => (
            <SidebarButton
              key={item.value}
              label={item.label}
              icon={item.icon}
              onClick={item.onClick}
              isActive={selectedFilter === item.value}
            />
          ))}
          <GroupList handleGroupClick={handleGroupClick} />
        </div>
        <div>
          {/* <SidebarButton
            label="휴지통"
            icon={icons.trashCan}
            onClick={() => dispatch(setFilter("trash"))}
            isActive={selectedFilter === "trash"}

          /> */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

import angleDoubleLeft from "../../assets/icons/angle-double-left.svg";
import angleDoubleRight from "../../assets/icons/angle-double-right.svg";
import angleSmallLeft from "../../assets/icons/angle-small-left.svg";
import angleSmallRight from "../../assets/icons/angle-small-right.svg";
import bellRegular from "../../assets/icons/bell-regular.svg";
import bellSolid from "../../assets/icons/bell-solid.svg";
import calendarRegular from "../../assets/icons/calendar-regular.svg";
import calendarSolid from "../../assets/icons/calendar-solid.svg";
import chatRegular from "../../assets/icons/chat-regular.svg";
import chatSolid from "../../assets/icons/chat-solid.svg";
import checkboxRegular from "../../assets/icons/checkbox-regular.svg";
import checkboxSolid from "../../assets/icons/checkbox-solid.svg";
import clipboardRegular from "../../assets/icons/clipboard-regular.svg";
import clipboardSolid from "../../assets/icons/clipboard-solid.svg";
import cloneRegular from "../../assets/icons/clone-regular.svg";
import cloneSolid from "../../assets/icons/clone-solid.svg";
import documentSigned from "../../assets/icons/document-signed.svg";
import documentSignedSolid from "../../assets/icons/document-signed-solid.svg";
import folderRegular from "../../assets/icons/folder-regular.svg";
import folderSolid from "../../assets/icons/folder-solid.svg";
import homeRegular from "../../assets/icons/home-regular.svg";
import homeSolid from "../../assets/icons/home-solid.svg";
import listUlSolid from "../../assets/icons/list-ul-solid.svg";
import magnifyingGlassSolid from "../../assets/icons/magnifying-glass-solid.svg";
import menuRegular from "../../assets/icons/menu-regular.svg";
import starColor from "../../assets/icons/star-color.svg";
import starGrey from "../../assets/icons/star-grey.svg";
import starRegular from "../../assets/icons/star-regular.svg";
import starSolid from "../../assets/icons/star-solid.svg";
import trashCanRegular from "../../assets/icons/trash-can-regular.svg";
import trashCanSolid from "../../assets/icons/trash-can-solid.svg";
import trashCanColor from "../../assets/icons/trash-can-color.svg";
import userRegular from "../../assets/icons/user-regular.svg";
import userSolid from "../../assets/icons/user-solid.svg";
import videoRegular from "../../assets/icons/video-regular.svg";
import videoSolid from "../../assets/icons/video-solid.svg";
import videoGrey from "../../assets/icons/video-grey.svg";
import alarmRegular from "../../assets/icons/alarm-regular.svg";
import alarmSolid from "../../assets/icons/alarm-solid.svg";
import menuDot from "../../assets/icons/menu-dots.svg";
import pencilRegular from "../../assets/icons/pencil-regular.svg";
import menuBurger from "../../assets/icons/menu-burger.svg";
import cross from "../../assets/icons/cross-small.svg";

const icons = {
  angleDoubleLeft,
  angleDoubleRight,
  angleSmallLeft,
  angleSmallRight,
  bell: { default: bellRegular, active: bellSolid },
  calendar: { default: calendarRegular, active: calendarSolid },
  chat: { default: chatRegular, active: chatSolid },
  checkbox: { default: checkboxRegular, active: checkboxSolid },
  clipboard: { default: clipboardRegular, active: clipboardSolid },
  clone: { default: cloneRegular, active: cloneSolid },
  documentSigned: { default: documentSigned, active: documentSignedSolid },
  folder: { default: folderRegular, active: folderSolid },
  home: { default: homeRegular, active: homeSolid },
  listUlSolid,
  magnifyingGlassSolid,
  menuRegular,
  star: {
    default: starRegular,
    active: starSolid,
    color: starColor,
    grey: starGrey,
  },
  trashCan: {
    default: trashCanRegular,
    active: trashCanSolid,
    color: trashCanColor,
  },
  user: { default: userRegular, active: userSolid },
  video: { default: videoRegular, active: videoSolid, grey: videoGrey },
  alarm: { default: alarmRegular, active: alarmSolid },
  menuDot: { default: menuDot },
  pencil: { default: pencilRegular },
  menu: { default: menuBurger },
  cross: { default: cross },
};

export default icons;

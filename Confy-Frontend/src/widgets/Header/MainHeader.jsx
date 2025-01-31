import React from "react";
import SearchBar from "./SearchBar";
import styles from "../Header/MainHeader.module.css";

const MainHeader = () => {
  return (
    <div className={styles.mainHeader}>
      <SearchBar />
    </div>
  );
};

export default MainHeader;

import React, { useState } from "react";
import icon from "../../assets/icons/magnifying-glass-solid.svg";
import styles from "../Header/SearchBar.module.css";

const SearchBar = ({ onSearch }) => {
  return (
    <div className={styles.searchBar}>
      <button>
        <img src={icon} alt="" />
      </button>
      <input
        type="text"
        className={styles.inputField}
        placeholder="검색어를 입력하세요"
      />
    </div>
  );
};

export default SearchBar;

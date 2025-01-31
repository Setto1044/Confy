import React, { useState } from "react";
import styles from "../Header/SearchBar.module.css";

const SearchBar = ({ onSearch }) => {
  return (
    <div className={styles.searchBar}>
      <button>검색</button>
      <input
        type="text"
        className={styles.inputField}
        placeholder="검색어를 입력하세요"
      />
    </div>
  );
};

export default SearchBar;

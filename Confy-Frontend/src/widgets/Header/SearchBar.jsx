import React, { useState, useEffect } from "react";
import icon from "../../assets/icons/magnifying-glass-solid.svg";
import styles from "../Header/SearchBar.module.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null); // ✅ 타이머 상태 추가

  // ✅ 입력할 때마다 타이머를 리셋하고, 300ms 후 검색 실행
  useEffect(() => {
    if (query.trim() === "") return; // 빈 문자열이면 실행 안 함

    if (typingTimeout) {
      clearTimeout(typingTimeout); // 기존 타이머 삭제
    }

    const newTimeout = setTimeout(() => {
      onSearch(query); // ✅ 300ms 후 검색 실행
    }, 300);

    setTypingTimeout(newTimeout); // 새로운 타이머 설정

    return () => clearTimeout(newTimeout); // ✅ 컴포넌트 언마운트 시 클리어
  }, [query, onSearch]); // ✅ query가 변경될 때만 실행됨

  // ✅ 버튼 클릭 시 즉시 검색 실행
  const handleSearchClick = () => {
    if (query.trim() !== "") {
      onSearch(query); // ✅ 버튼 클릭 시 바로 검색 실행
    }
  };

  return (
    <div className={styles.searchBar}>
      <button onClick={handleSearchClick}>
        {" "}
        {/* ✅ 버튼 클릭 시 즉시 검색 */}
        <img src={icon} alt="Search" />
      </button>
      <input
        type="text"
        className={styles.inputField}
        value={query}
        onChange={(e) => setQuery(e.target.value)} // ✅ 입력할 때 query 업데이트
      />
    </div>
  );
};

export default SearchBar;

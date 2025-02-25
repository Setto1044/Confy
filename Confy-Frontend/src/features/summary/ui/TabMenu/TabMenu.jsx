import styles from './TabMenu.module.css';

const TabMenu = ({ activeTab, setActiveTab, leftOnly, rightOnly }) => {
  // 왼쪽(스크립트)과 오른쪽(시각화, 요약정리) 탭을 구분
  const leftTabs = ["스크립트"];
  const rightTabs = ["시각화", "요약정리"];
  
  // leftOnly가 true면 왼쪽 탭만, rightOnly가 true면 오른쪽 탭만 표시
  const visibleTabs = leftOnly 
    ? leftTabs 
    : rightOnly 
    ? rightTabs 
    : [...leftTabs, ...rightTabs]; // 모바일에서는 모든 탭 표시

  return (
    <div className={styles.tabContainer}>
      {visibleTabs.map((tab) => (
        <button
          key={tab}
          className={`${styles.tab} 
            ${activeTab === tab ? styles.active : ''} 
            ${leftOnly ? styles.leftOnly : ''}
            ${rightOnly ? styles.rightOnly : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabMenu;
import styles from "../Footer/HomeFooter.module.css";

const HomeFooter = () => {
  return (
    <footer className={styles.HomeFooter}> {/* 변경된 부분 */}
      <div className={styles.footerText}>
        <p>SSAFY 12기 508조 Confy</p>
        <p>팀장: 배석진</p>
        <p>팀원: 강명주 김예진 노영단 신유영 예세림</p>
        <p>&copy; 2025 Confy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default HomeFooter;

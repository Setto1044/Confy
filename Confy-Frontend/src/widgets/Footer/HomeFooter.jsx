import React from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./HomeFooter.module.css";
import LogoBlack from "../../assets/svgs/full-logo-black.svg";

const HomeFooter = () => {
  return (
    <footer className={styles.HomeFooter}>
      <div className={styles.footerContent}>
        <div className={styles.footerLogo}>
          <Link to="/">
            <div className={styles.logo}>
              <img src={LogoBlack} alt="Confy Logo_black" />
            </div>
          </Link>
        </div>
        <div className={styles.footerInfo}>
          <div className={styles.teamSection}>
            <h3>SSAFY 12기 508조</h3>
            <div className={styles.teamMembers}>
              <p>
                <span>팀장</span> 배석진
              </p>
              <p>
                <span>팀원</span> 강명주 · 김예진 · 노영단 · 신유영 · 예세림
              </p>
            </div>
          </div>
          <div className={styles.copyright}>
            &copy; 2025 Confy. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;

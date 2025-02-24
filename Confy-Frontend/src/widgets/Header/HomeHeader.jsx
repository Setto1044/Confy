import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "../../features/main/Profile/Logout.jsx";
import LogoBlack from "../../assets/svgs/full-logo-black.svg";
import Button from "../../widgets/Button/Button.jsx";
import styles from "../Header/HomeHeader.module.css";

const navigation = [
  { name: "사용자 가이드", href: "/guides", current: false },
  // { name: "자주 묻는 질문", href: "#", current: false },
];

const HomeHeader = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // 로그인 상태 확인

  return (
    <div className={styles.homeHeader}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div className={styles.logoItem}>
          {/* Logo */}
          <Link to="/">
            <div className={styles.logo}>
              <img src={LogoBlack} alt="Confy Logo_black" />
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div
          className={styles.logoItem}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              style={{ textDecoration: "none" }}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>

      {/* Right Section */}
      {isAuthenticated ? (
        <Logout asButton={true} /> // ✅ 버튼 컴포넌트로 표시
      ) : (
        <Button onClick={() => navigate("/login")}>로그인</Button>
      )}
    </div>
  );
};

export default HomeHeader;

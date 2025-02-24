import { useNavigate, Link } from "react-router-dom";
import LogoBlack from "../../assets/svgs/full-logo-black.svg";
import styles from "../Header/LoginHeader.module.css";

const navigation = [
  { name: "사용자 가이드", href: "#", current: false },
  { name: "자주 묻는 질문", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const LoginHeader = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.loginHeader}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link to="/">
          <img src={LogoBlack} alt="Confy Logo_black" />
        </Link>
      </div>
    </div>
  );
};

export default LoginHeader;

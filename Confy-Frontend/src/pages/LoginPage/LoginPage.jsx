import LoginForm from "../../features/login/ui/LoginForm";
import LoginHeader from "../../widgets/Header/LoginHeader";
import styles from "../LoginPage/LoginPage.module.css";

const LoginPage = () => {
  return (
    <div className={styles.formContainer}>
      <LoginHeader />
      <LoginForm />
    </div>
  );
};

export default LoginPage;

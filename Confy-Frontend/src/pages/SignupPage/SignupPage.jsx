import LoginHeader from "../../widgets/Header/LoginHeader";
import SignupForm from "../../features/signup/ui/SignupForm";
import styles from "../LoginPage/LoginPage.module.css";

const SignupPage = () => {
  return (
    <div className={styles.formContainer}>
      <LoginHeader />
      <SignupForm />
    </div>
  );
};

export default SignupPage;

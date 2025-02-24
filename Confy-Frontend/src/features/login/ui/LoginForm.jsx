import React, { useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../entities/auth/model/authSlice";
import styles from "./LoginForm.module.css";
import loginIllustration from "../../../assets/images/login-illustration.png";
import authApi from "../../../shared/api/authApi";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await authApi.login(form.email, form.password);

      if (response.success) {
        localStorage.setItem("token", response.data.token); // 토큰 저장
        dispatch(login({ email: form.email })); // Redux에 로그인 상태 저장

        navigate("/main");
      } else {
        setError(response.message || "로그인 실패");
      }
    } catch (error) {
      setError("로그인 중 오류가 발생했습니다.");
    }
  };


  return (
    <div>
      <div className={styles.formWrapper}>
        {/* 왼쪽 이미지 */}
        <div className={styles.imageContainer}>
          <img src={loginIllustration} alt="Login Illustration" />
        </div>

        {/* 로그인 폼 */}
        <div className={styles.formBox}>
          <h2 className={styles.title}>로그인</h2>
          {error && <p className={styles.error}>{error}</p>}
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                name="email"
                className={styles.inputField}
                value={form.email}
                onChange={handleChange}
                placeholder="이메일"
              />

              <input
                type="password"
                name="password"
                className={styles.inputField}
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호"
              />
            </div>
            <button type="submit" className={styles.button}>
              로그인
            </button>
          </form>
          <div className={styles.links}>
            <a href="#">비밀번호 재설정</a> | <Link to="/signup">회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../../shared/api/authApi";
import styles from "./SignupForm.module.css";
import signupIllustration from "../../../assets/images/login-illustration.png"; // 이미지 경로

const SignupForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "", // 이메일 (username = email)
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [error, setError] = useState(null);

  // 🔹 입력값 변경 핸들러 (이름을 활용해 동적 업데이트)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "password" && value.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
    } else if (name === "confirmPassword" && value !== form.password) {
      setError("비밀번호가 일치하지 않습니다.");
    } else {
      setError(null);
    }
  };

  // 🔹 유효성 검사
  const validateForm = () => {
    if (!form.fullName || !form.email || !form.password) {
      setError("모든 필드를 입력해주세요.");
      return false;
    }
    if (form.password.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return false;
    }
    if (!form.agree) {
      setError("개인 정보 수집 및 이용에 동의해야 합니다.");
      return false;
    }
    return true;
  };

  // 🔹 회원가입 핸들러
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await authApi.signup(
        form.fullName,
        form.email,
        form.password
      );

      if (response?.success) {
        alert(response.message || "회원가입 성공!");
        navigate("/login");
      } else {
        console.log("❌ 회원가입 실패:", response?.message);
        setError(response?.message || "회원가입 실패");
      }
    } catch (error) {
      console.error("❌ 회원가입 오류:", error);
      setError(
        error.response?.data?.message || "회원가입 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.formWrapper}>
        {/* 왼쪽 이미지 */}
        <div className={styles.imageContainer}>
          <img src={signupIllustration} alt="Signup Illustration" />
        </div>

        {/* 회원가입 폼 */}
        <div className={styles.formBox}>
          <h2 className={styles.title}>안녕하세요!</h2>
          {error && <p className={styles.error}>{error}</p>}{" "}
          {/* 🔹 에러 메시지 표시 */}
          <form className={styles.form} onSubmit={handleSignup}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="fullName"
                className={styles.inputField}
                value={form.fullName}
                onChange={handleChange}
                placeholder="이름"
              />
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
              <input
                type="password"
                name="confirmPassword"
                className={styles.inputField}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호 확인"
              />
            </div>

            {/* 체크박스 (개인정보 수집 동의) */}
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="agree"
                id="agree"
                checked={form.agree}
                onChange={handleChange}
              />
              <label htmlFor="agree">
                [필수] 개인 정보 수집 및 이용에 동의합니다.
              </label>
            </div>

            {/* 회원가입 버튼 */}
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "회원가입 중..." : "회원가입"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;

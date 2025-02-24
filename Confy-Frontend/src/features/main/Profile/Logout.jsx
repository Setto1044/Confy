import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // Redux
import { logout } from "../../../shared/store/authSlice";
import authApi from "../../../shared/api/authApi";
import Button from "../../../widgets/Button/Button";

const Logout = ({ asButton = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
  
    const handleLogout = async () => {
      setError(null);
      
      const response = await authApi.logout();
      
      if (response.success) {
        dispatch(logout()); // ✅ Redux 상태 초기화
        localStorage.clear() // ✅ 로컬 스토리지 초기화
        navigate("/login"); // ✅ 로그인 페이지로 이동
      } else {
        setError(response.message || "로그아웃 실패");
      }
    };
  
    return (
      <div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {asButton ? ( // ✅ asButton이 true면 Button 컴포넌트 사용
          <Button onClick={handleLogout}>로그아웃</Button>
        ) : (
          <button 
            onClick={handleLogout} 
            style={{ padding: "10px", cursor: "pointer" }} // ✅ 기존 스타일 유지
          >
            로그아웃
          </button>
        )}
      </div>
    );
  };

export default Logout;

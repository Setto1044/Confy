import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "../HomePage/Homepage.module.css";
import HomeHeader from "../../widgets/Header/HomeHeader";
import HomeFooter from "../../widgets/Footer/HomeFooter";
import mainComponent from "../../assets/images/Main_Component.png";

const HomePage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // 🔹 로그인 상태 확인

  const handleStartClick = () => {
    if (isAuthenticated) {
      navigate("/main");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="home-container">
      <HomeHeader />
      <div className="h-[144vh]">
        {" "}
        {/* min-h-screen에서 변경 */}
        <div
          className="w-full h-[144vh] relative"
          style={{
            background:
              "linear-gradient(90deg, #b0d7ff 6%, #c4f4ff 43%, #ddfaff 67%, #92d0f6 95%, #7dd4ff 100%)",
          }}
        >
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
            <h1
              className={`text-5xl font-black text-gray-800 mb-8 tracking-tight ${styles.mainTitle}`}
              style={{ fontSize: "4rem", fontWeight: "600" }}
            >
              회의를 더 스마트하게
            </h1>
            <p
              className={`text-gray-600 text-2xl mb-10  ${styles.description}`}
            >
              <span
                className={`text-blue-600 font-bold ${styles.highlightedText} ${styles.highlightedText1}`}
              >
                실시간 요약
              </span>
              과{" "}
              <span
                className={`text-blue-600 font-bold ${styles.highlightedText} ${styles.highlightedText2}`}
              >
                직관적인 시각화
              </span>
              로
              <br />더 빠르고 효율적인 회의를 경험하세요
            </p>
            <button
              onClick={handleStartClick}
              className="bg-blue-500 text-white px-3 py-3 rounded-lg hover:bg-blue-600 transition-colors text-xl font-bold"
              style={{ borderRadius: "8px", marginTop: "2rem" }}
            >
              Confy 시작하기
            </button>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-7xl">
            <img
              src={mainComponent}
              alt="Main Component Preview"
              className="w-full h-auto object-contain scale-100"
            />
          </div>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};

export default HomePage;

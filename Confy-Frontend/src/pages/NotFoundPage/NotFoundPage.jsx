import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate("/main");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Main Content */}
      <div className="text-center px-4">
        <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 mb-4 animate-pulse">
          404
        </h1>
        <h2 className="text-3xl font-semibold text-blue-800 mb-2">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-xl text-blue-600 mb-8 max-w-md whitespace-nowrap">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>


        {/* Button with hover effect */}
        <button
          onClick={handleGoHome}
          className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg
                     hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl !rounded-lg"
        >
          홈으로 돌아가기
        </button>
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-blue-200 rounded-full opacity-50"></div>
        <div className="absolute top-32 -right-16 w-48 h-48 bg-blue-300 rounded-full opacity-30"></div>
        <div className="absolute -bottom-16 -left-8 w-40 h-40 bg-blue-400 rounded-full opacity-20"></div>
      </div>
    </div>
  );
};

export default NotFoundPage;

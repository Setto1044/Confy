import React from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async"; 
import GlobalMetaTags from "../shared/metaTag/GlobalMetaTags";
import Routes from "./route";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../shared/store/authSlice";
import "react-toastify/dist/ReactToastify.css"; // 이 줄을 추가해주세요

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(login(token)); // ✅ 새로고침 시 Redux에 저장
    }
  }, [dispatch]);
  return (
    <div>
      <HelmetProvider>
        {/* 메타태그 */}
        <GlobalMetaTags />
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
        <Router>
          <Routes />
        </Router>
      </HelmetProvider>
    </div>
  );
}

export default App;

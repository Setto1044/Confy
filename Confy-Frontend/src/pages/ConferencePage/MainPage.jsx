// 지워야할 페이지?? pages/MainPage/MainPage.jsx랑 합침

import React from "react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  const handleGoToMeeting = () => {
    navigate("/meeting");
  };

  return (
    <div>
      <h1>Main Page</h1>
      <button onClick={handleGoToMeeting}>Go to Meeting</button>
    </div>
  );
};

export default MainPage;

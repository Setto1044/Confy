import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import MainPage from "../pages/MainPage/MainPage"; // 대시보드 역할
import GuidePage from "../pages/GuidePage/GuidePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import SignupPage from "../pages/SignupPage/SignupPage";
import SummaryPage from "../pages/SummaryPage/SummaryPage";
import EditVisualizationPage from "../pages/EditVisualizationPage/EditVisualizationPage";
import MeetingPage from "../pages/ConferencePage/MeetingPage"; // 실시간 화상회의 페이지
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"; // 별도 404 페이지
import OpenViduContainder from "../features/conference/openvidu/OpenViduContainer";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 랜딩 페이지 */}
      <Route path="/" element={<HomePage />} />
      {/* 가이드 페이지 */}
      <Route path="/guides" element={<GuidePage />} />
      {/* 인증 관련 페이지 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      {/* 메인 대시보드 (회의 기록 목록 포함) */}
      <Route path="/main" element={<MainPage />} />
      {/* 실시간 화상 회의 (roomId는 OpenVidu에서 생성된 방 ID) */}
      {/* {/* <Route path="/meeting/:roomId" element={<MeetingPage />} /> */}
      <Route path="/meetings" element={<MeetingPage />} />
      <Route path="/meetings/room" element={<OpenViduContainder />} />
      {/* 특정 회의의 요약 및 시각화 편집 */}
      <Route path="/meetings/:meetingId/summary" element={<SummaryPage />} />
      <Route
        path="/meetings/:meetingId/edit-visualization"
        element={<EditVisualizationPage />}
      />
      {/* 예외 처리 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;

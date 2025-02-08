import React from "react";
import MeetingRoom from "../../features/conference/openvidu/ui/MeetingRoom";
import Sidebar from "../../features/conference/Sidebar/Sidebar";

const TestPage = () => {
  return (
    <>
        <h1>사이드바 테스트 페이지</h1>
        <MeetingRoom/>
        <Sidebar />
    </>
  );
};

export default TestPage;

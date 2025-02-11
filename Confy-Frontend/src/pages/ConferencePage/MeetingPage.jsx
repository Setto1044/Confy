import React from "react";
import OpenVidu from "../../features/conference/openvidu/OpenViduContainer"; // OpenVidu 컴포넌트를 가져옵니다.

const MeetingPage = () => {
  return (
    <div>
      <OpenVidu /> {/* OpenVidu 컴포넌트를 렌더링 */}
    </div>
  );
};

export default MeetingPage;

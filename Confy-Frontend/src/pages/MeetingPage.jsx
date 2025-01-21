import React from "react";
import OpenVidu from "../components/openvidu/OpenViduContainer"; // OpenVidu 컴포넌트를 가져옵니다.

const MeetingPage = () => {
    return (
        <div>
            <h1>Meeting Page</h1>
            <OpenVidu /> {/* OpenVidu 컴포넌트를 렌더링 */}
        </div>
    );
};

export default MeetingPage;

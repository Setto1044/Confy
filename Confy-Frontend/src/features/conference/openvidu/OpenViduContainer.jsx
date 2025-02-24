// import {
//   LocalVideoTrack,
//   LocalAudioTrack,
//   RemoteParticipant,
//   RemoteTrack,
//   RemoteTrackPublication,
//   Room,
//   RoomEvent,
//   createLocalTracks,
// } from "livekit-client";
import { Room, RoomEvent, createLocalTracks } from "livekit-client";
import { useState, useEffect, useRef, useCallback } from "react";
import VideoComponent from "./VideoComponent";
import AudioComponent from "./AudioComponent";
import { useLocation, useNavigate } from "react-router-dom";
import {
  setMeetingId,
} from "../../../shared/store/meetingIdSlice";
import { useSelector, useDispatch } from "react-redux";
import styles from "./OpenViduContainer.module.css";
import Sidebar from "../Sidebar/Sidebar";
import CameraPreview from "../openvidu/ui/CameraPreview";
import ConferenceHeader from "../../../widgets/Header/ConferenceHeader";

let APPLICATION_SERVER_URL = "";
let LIVEKIT_URL = "";
configureUrls();

function configureUrls() {
  if (!APPLICATION_SERVER_URL) {
    if (window.location.hostname === "localhost") {
      APPLICATION_SERVER_URL = "http://localhost:6080/";
    } else {
      APPLICATION_SERVER_URL = "https://" + window.location.hostname + ":6443/";
    }
  }
  if (!LIVEKIT_URL) {
    if (window.location.hostname === "localhost") {
      LIVEKIT_URL = "ws://localhost:7880/";
    } else {
      LIVEKIT_URL = "wss://" + window.location.hostname + ":7443/";
    }
  }
}

function OpenVidu() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const UUID = searchParams.get("UUID"); // URL에 UUID가 있으면 회의 예약 모드
  //////////////////////////////////////////////////////////
  // Redux에서 참여자 목록, meetingId 가져오기
  const dispatch = useDispatch();
  const meetingId = useSelector((state) => state.meetingId.meetingId); // Redux에서 meetingId 가져오기

  // 사이드바 상태 관리
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  ///////////////////////////////////////////////////////////
  const [room, setRoom] = useState(undefined);
  const [localVideoTrack, setLocalVideoTrack] = useState(undefined);
  const [localAudioTrack, setLocalAudioTrack] = useState(undefined);

  const [remoteTracks, setRemoteTracks] = useState([]);

  useEffect(() => {
    const itemCount = remoteTracks.length - 2; // 본인 포함
    const rows = Math.round(Math.sqrt(itemCount)); // 행 개수
    const cols = Math.ceil(itemCount / rows); // 열 개수

    const videoGrid = document.querySelector(`.${styles.videoGrid}`);
    if (videoGrid) {
      videoGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    }
  }, [remoteTracks]);

  const [participantName, setParticipantName] = useState(
    "Participant" + Math.floor(Math.random() * 100)
  );
  const [roomName, setRoomName] = useState("Test Room");
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  // 사용자의 장치 유무 (입장 시 뿐 아니라 이후에도 업데이트)
  const [hasCameraDevice, setHasCameraDevice] = useState(false);
  const [hasMicDevice, setHasMicDevice] = useState(false);

  // STT 관련 결과값 저장 (필요시 사용)
  const [sttResults, setSttResults] = useState("");
  const recognizerRef = useRef(null);

  const subscriptionKey = import.meta.env.VITE_API_AZURE; // Azure 구독 키 (실제 값으로 설정)
  const serviceRegion = "koreacentral"; // Azure 서비스 지역

  // 마이크가 켜져 있고 localAudioTrack가 있을 경우 STT 시작, 그렇지 않으면 STT 중지
  useEffect(() => {
    if (localAudioTrack && isMicOn) {
      startSTT();
    } else {
      stopSTT();
    }
  }, [localAudioTrack, isMicOn]);

  // 장치 변경 이벤트 등록: 회의 입장 후에도 사용자가 장치를 연결/해제하면 상태 업데이트
  useEffect(() => {
    const updateDeviceAvailability = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setHasCameraDevice(
          devices.some((device) => device.kind === "videoinput")
        );
        setHasMicDevice(devices.some((device) => device.kind === "audioinput"));
      }
    };

    navigator.mediaDevices.addEventListener(
      "devicechange",
      updateDeviceAvailability
    );
    // 컴포넌트 마운트 시에도 한 번 체크
    updateDeviceAvailability();

    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        updateDeviceAvailability
      );
    };
  }, []);

  ////////////////////////////////////////////////
  // ✅ 회의 종료 요청 함수
  // ✅ 회의 종료 함수 -> 참여자 0명일 때 호출
  const handleEndMeeting = useCallback(async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_APPLICATION_SERVER_URL
        }/meetings/room/${meetingId}/finish`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ meetingUUID: UUID }),
        }
      );

      if (!response.ok) {
        throw new Error(`❌ 회의 종료 요청 실패: ${response.status}`);
      }

      console.log("✅ 회의 종료 완료!");
    } catch (error) {
      console.error("❌ 회의 종료 요청 실패:", error);
    }
  }, [meetingId, UUID]); // 의존성 배열 추가


  // ✅ 참가자가 모두 나갔을 때 회의 종료 요청
 
  /////////////////////////////////////////////////

  // 만약 마이크 장치가 사라졌다면 자동으로 마이크를 off 처리
  useEffect(() => {
    if (!hasMicDevice && isMicOn && localAudioTrack) {
      localAudioTrack.mute();
      setIsMicOn(false);
    }
  }, [hasMicDevice, isMicOn, localAudioTrack]);

  // 만약 카메라 장치가 사라졌다면 자동으로 카메라를 off 처리
  useEffect(() => {
    if (!hasCameraDevice && isCameraOn && localVideoTrack) {
      localVideoTrack.mute();
      setIsCameraOn(false);
    }
  }, [hasCameraDevice, isCameraOn, localVideoTrack]);

  async function joinRoom(uuidParam) {
    const uuidToUse = uuidParam || UUID;
    const newRoom = new Room();
    setRoom(newRoom);

    newRoom.on(
      RoomEvent.TrackSubscribed,
      (_track, publication, participant) => {
        setRemoteTracks((prev) => [
          ...prev,
          {
            trackPublication: publication,
            participantIdentity: participant.identity,
          },
        ]);
      }
    );

    newRoom.on(RoomEvent.TrackUnsubscribed, (_track, publication) => {
      setRemoteTracks((prev) =>
        prev.filter(
          (track) => track.trackPublication.trackSid !== publication.trackSid
        )
      );
    });

    try {
      const token = await getToken(participantName, uuidToUse);
      await newRoom.connect(import.meta.env.VITE_LIVEKIT_URL, token);

      // joinRoom 시에도 최신 장치 유무를 체크
      let foundCamera = false;
      let foundMic = false;
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        foundCamera = devices.some((device) => device.kind === "videoinput");
        foundMic = devices.some((device) => device.kind === "audioinput");
      }
      setHasCameraDevice(foundCamera);
      setHasMicDevice(foundMic);

      // 장치가 있으면 트랙 생성 및 퍼블리시합니다.
      const localTracks = await createLocalTracks({
        audio: foundMic,
        video: foundCamera,
      });
      localTracks.forEach((track) => {
        newRoom.localParticipant.publishTrack(track);
        if (track.kind === "video") {
          setLocalVideoTrack(track);
        } else if (track.kind === "audio") {
          setLocalAudioTrack(track);
        }
      });

      // 초기 상태 설정: 장치가 있으면 켜진 상태, 없으면 꺼진 상태
      setIsCameraOn(foundCamera);
      setIsMicOn(foundMic);
    } catch (error) {
      console.log("Error connecting to the room:", error.message);
      await leaveRoom();
    }
  }

  async function leaveRoom() {
    if (!room) return;
  
    try {
      const token = localStorage.getItem("accessToken");
      console.log("🔍 JWT 토큰 확인:", token); // ✅ 디버깅 코드 추가
  
      if (!token) {
        console.error("❌ JWT 토큰이 없습니다. 로그인이 필요합니다.");
        alert("로그인이 필요합니다.");
        return;
      }
  
      const response = await fetch(
        `${import.meta.env.VITE_APPLICATION_SERVER_URL}/meetings/room/${meetingId}/exit`,
        {
          method: "Post",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ `Bearer` 추가
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
  
      if (!response.ok) {
        throw new Error(`❌ 회의 나가기 요청 실패: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("✅ 회의 나가기 요청 성공!", data);
  
      const remainingParticipants = parseInt(data.data.onlineParticipants, 10);
      if (isNaN(remainingParticipants)) {
        console.warn("❗ 남은 참가자 수를 확인할 수 없습니다:", data);
      } else if (remainingParticipants === 0) {
        console.log("🚪 마지막 참가자가 퇴장했습니다. 회의 종료 요청 실행.");
        await handleEndMeeting();
      }

      // 클라이언트 상태 업데이트
      await room.disconnect();
      setRoom(undefined);
      setLocalVideoTrack(undefined);
      setLocalAudioTrack(undefined);
      setRemoteTracks([]);
      stopSTT(); // STT 중지

      navigate("/main");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("❌ 회의 나가기 오류:", error);
    }
  }

  // 토큰 요청 (회의 예약 모드용)
  async function getToken(participantName, uuid) {
    if (!uuid) {
      console.error("UUID가 없습니다. 회의 방을 확인하세요.");
      alert("유효한 회의 방 정보가 없습니다.");
      return;
    }

    const token = localStorage.getItem("accessToken"); // 전역 상태에서 가져오기
    
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    const baseURL = import.meta.env.VITE_APPLICATION_SERVER_URL;
    try {
      const response = await fetch(`${baseURL}/token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid,
          speaker: participantName,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to get token: ${errorText}`);
      }

      const data = await response.json();
      // console.log("speaker:", participantName);
      // console.log("uuid: " + uuid);

      dispatch(setMeetingId(data.meetingId));

      return data.token;
    } catch (error) {
      console.error("API 요청 오류:", error.message);
      alert(`서버 연결 오류: ${error.message}`);
      throw error;
    }
  }

  // 카메라 토글 함수
  function toggleCamera() {
    // 현재 장치가 없으면 경고 후 동작 중단
    if (!hasCameraDevice) {
      alert("카메라 장치가 없습니다.");
      return;
    }

    if (isCameraOn) {
      if (localVideoTrack) {
        localVideoTrack.mute();
      }
      setIsCameraOn(false);
    } else {
      if (localVideoTrack) {
        localVideoTrack.unmute();
      } else {
        createLocalTracks({ video: true })
          .then((tracks) => {
            const videoTrack = tracks.find((track) => track.kind === "video");
            if (videoTrack && room) {
              room.localParticipant.publishTrack(videoTrack);
              setLocalVideoTrack(videoTrack);
            }
          })
          .catch((error) => {
            console.error("Error creating video track:", error);
          });
      }
      setIsCameraOn(true);
    }
  }

  // 마이크 토글 함수
  function toggleMic() {
    // 현재 장치가 없으면 경고 후 동작 중단
    if (!hasMicDevice) {
      alert("마이크 장치가 없습니다.");
      return;
    }

    if (isMicOn) {
      if (localAudioTrack) {
        localAudioTrack.mute();
      }
      setIsMicOn(false);
    } else {
      if (localAudioTrack) {
        localAudioTrack.unmute();
      } else {
        createLocalTracks({ audio: true })
          .then((tracks) => {
            const audioTrack = tracks.find((track) => track.kind === "audio");
            if (audioTrack && room) {
              room.localParticipant.publishTrack(audioTrack);
              setLocalAudioTrack(audioTrack);
            }
          })
          .catch((error) => {
            console.error("Error creating audio track:", error);
          });
      }
      setIsMicOn(true);
    }
  }

  // Azure STT 실행 함수
  function startSTT() {
    if (!window.SpeechSDK || !localAudioTrack) {
      console.error("Speech SDK not loaded or local audio track missing");
      return;
    }

    const SpeechSDK = window.SpeechSDK;
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      subscriptionKey,
      serviceRegion
    );
    speechConfig.speechRecognitionLanguage = "ko-KR";
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

    const recognizer = new SpeechSDK.SpeechRecognizer(
      speechConfig,
      audioConfig
    );
    recognizerRef.current = recognizer;

    // recognizer.recognizing = function(s, e) {
    //   console.log("Recognizing:", e.result.text);
    // };

    recognizer.recognized = function (s, e) {
      if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        console.log("Recognized:", e.result.text);
        sendSentence(e.result.text);
        // sendSentence(e.result.text, meetingId);
        // setSttResults(prev => prev + e.result.text + "\n");
      }
    };

    recognizer.startContinuousRecognitionAsync();
  }

  // STT된 내용 서버로 전송
  async function sendSentence(content) {
    const data = {
      speaker: participantName,
      content: content,
    };
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        import.meta.env.VITE_APPLICATION_SERVER_URL + `/stt/${meetingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        const timestamp = new Date().toISOString().slice(0, 19);
        const newEntry = { speaker: participantName, content, timestamp };

        setSttResults((prev) => {
          const updatedResults = [...prev, newEntry];
          console.log("Updated STT Results:", updatedResults);
          return updatedResults;
        });

        console.log(response);
        console.log("Data sent successfully");
      } else {
        console.error("Error sending data");
      }
    } catch (error) {
      console.error("Network error: ", error);
    }
  }

  // Azure STT 멈추기 함수
  function stopSTT() {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync(() => {
        console.log("STT stopped");
        recognizerRef.current = null;
      });
    }
  }

  // ──────────────────────────────
  // 회의 시작 모드용 함수: 백엔드에서 UUID 생성 후 /meeting?UUID=...로 이동
  async function handleStartMeeting() {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        import.meta.env.VITE_APPLICATION_SERVER_URL + "meetings/room/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            meetingName:
              "startedAt이 현재가 아니라면(예약) 회의실로 바로 들어가지 않도록 수정해주셔요.",
            startedAt: "2025-02-06T12:00:00",
            groupId: "1",
            visualType: "Tree",
          }),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate UUID: ${errorText}`);
      }

      const data = await response.json();
      const newUUID = data.data.uuid;
      console.log(newUUID);
      //const test = data.data.UUID
      //console.log("UUID로 조회" + test)
      // await joinRoom(newUUID)를 실행하여 회의에 입장한 후,
      //console.log(newUUID)
      await joinRoom(newUUID);
      // URL을 /meetings?UUID=새UUID 로 변경
      navigate(`/meetings/room?UUID=${newUUID}`);
    } catch (error) {
      console.error("Error generating UUID:", error.message);
    }
  }

  // URL에 이미 UUID가 있으면, 폼 제출 시 handleScheduleMeeting()에서 joinRoom()을 호출
  async function handleScheduleMeeting(e) {
    e.preventDefault();
    await joinRoom();
  }
  // ──────────────────────────────
  return (
    <>
      {!room ? (
        <div id="join">
          {!UUID ? (
            // UUID가 없으면 -> 회의 시작 모드
            <div>
              <h2>회의 시작</h2>
              <input
                id="participant-name"
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="이름 입력"
                required
              />
              <input
                id="room-name"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="방 이름 입력"
                required
              />
              <button onClick={handleStartMeeting}>회의 시작</button>
            </div>
          ) : (
            // URL에 UUID가 있으면 -> 회의 예약 모드 (사용자 검증 후 회의 입장)
            <>
              <ConferenceHeader />
              <main className="h-screen flex items-start justify-center py-8 bg-gray-50">
                <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg px-6 py-8 sm:px-8">
                  <form onSubmit={handleScheduleMeeting} className="space-y-6">
                    <CameraPreview />

                    {/* 참여자 이름 입력 필드 */}
                    <div>
                      <label
                        htmlFor="participant-name"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        참여자 이름
                      </label>
                      <input
                        id="participant-name"
                        type="text"
                        value={participantName}
                        onChange={(e) => setParticipantName(e.target.value)}
                        placeholder="이름 입력"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* 회의 입장 버튼 */}
                    <div className="flex justify-center pt-4">
                      <button type="submit" className={styles.blue_button}>
                        회의 입장
                      </button>
                    </div>
                  </form>
                </div>

                {/* 기존 주석 유지 */}
                {/* <form onSubmit={handleScheduleMeeting}>
                  <h2>회의 예약</h2>
                  <button type="submit">회의 입장</button>
                </form> */}
              </main>
            </>
          )}
        </div>
      ) : (
        // 회의실 입장 후 화면
        <div
          id="room"
          style={{ background: "black" }}
          className={isSidebarOpen ? styles.shifted : ""}
        >
          <div
            className={`${styles.videoGrid} ${
              isSidebarOpen ? styles.shifted : ""
            }`}
          >
            {isCameraOn && localVideoTrack ? (
              <VideoComponent
                track={localVideoTrack}
                participantIdentity={participantName}
                local={true}
              />
            ) : (
              <div
                id={"camera-" + participantName}
                className={styles.videoContainer}
                style={{ background: "black" }}
              >
                <div className="participant-data">
                  <p>{participantName + " (You)"}</p>
                </div>
              </div>
            )}

            {remoteTracks.map((remoteTrack) =>
              remoteTrack.trackPublication.kind === "video" ? (
                <VideoComponent
                  key={remoteTrack.trackPublication.trackSid}
                  track={remoteTrack.trackPublication.videoTrack}
                  participantIdentity={remoteTrack.participantIdentity}
                />
              ) : (
                <AudioComponent
                  key={remoteTrack.trackPublication.trackSid}
                  track={remoteTrack.trackPublication.audioTrack}
                />
              )
            )}
          </div>
          {/* 사이드바 */}
          <div>
            <Sidebar
              sttResults={sttResults}
              onSidebarToggle={handleSidebarToggle}
            />
          </div>
          {/* 하단 컨트롤바 */}
          <div
            className={`${styles.control_bar} ${
              isSidebarOpen ? styles.shifted : ""
            }`}
          >
            <button className={styles["blue_button"]} onClick={toggleCamera}>
              {isCameraOn ? "카메라 끄기" : "카메라 켜기"}
            </button>
            <button className={styles["blue_button"]} onClick={toggleMic}>
              {isMicOn ? "음소거" : "마이크 켜기"}
            </button>
            <button className={styles["red_button"]} onClick={leaveRoom}>
              나가기
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default OpenVidu;

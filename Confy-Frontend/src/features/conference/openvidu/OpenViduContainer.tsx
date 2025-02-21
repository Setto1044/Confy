import {
    LocalVideoTrack,
    LocalAudioTrack,
    RemoteParticipant,
    RemoteTrack,
    RemoteTrackPublication,
    Room,
    RoomEvent
} from "livekit-client";
import { useState, useEffect, useRef } from "react";
import VideoComponent from "./VideoComponent";
import AudioComponent from "./AudioComponent";

type TrackInfo = {
    trackPublication: RemoteTrackPublication;
    participantIdentity: string;
};

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

declare global {
    interface Window {
        SpeechSDK: any;
    }
}

function OpenVidu() {
    const [room, setRoom] = useState<Room | undefined>(undefined);
    //const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(undefined);
    const [localVideoTrack, setLocalVideoTrack] = useState<LocalVideoTrack | undefined>(undefined);
    const [localAudioTrack, setLocalAudioTrack] = useState<LocalAudioTrack | undefined>(undefined);
    const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);
    const [participantName, setParticipantName] = useState("Participant" + Math.floor(Math.random() * 100));
    const [roomName, setRoomName] = useState("Test Room");
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    //const [sttResults, setSttResults] = useState("");
    const recognizerRef = useRef<any>(null);

    const subscriptionKey = "2dn6yxjDyrFCrqvFUPNcD0xl4SUBOAg9sPL0Ap4YjneHOFJHrw0YJQQJ99BAACNns7RXJ3w3AAAYACOG6QUa"; // Azure 구독 키
    const serviceRegion = "koreacentral"; // Azure 서비스 지역

    useEffect(() => {
        if (localAudioTrack && isMicOn) {
            startSTT(); // 마이크가 켜진 경우 STT 시작
        } else {
            stopSTT(); // 마이크가 꺼진 경우 STT 중지
        }
    }, [localAudioTrack, isMicOn]);

    async function joinRoom() {
        const room = new Room();
        setRoom(room);

        room.on(
            RoomEvent.TrackSubscribed,
            (_track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
                setRemoteTracks((prev) => [
                    ...prev,
                    { trackPublication: publication, participantIdentity: participant.identity }
                ]);
            }
        );

        room.on(RoomEvent.TrackUnsubscribed, (_track: RemoteTrack, publication: RemoteTrackPublication) => {
            setRemoteTracks((prev) => prev.filter((track) => track.trackPublication.trackSid !== publication.trackSid));
        });

        try {
            const token = await getToken(roomName, participantName);
            await room.connect(LIVEKIT_URL, token);
            await room.localParticipant.enableCameraAndMicrophone();
            //setLocalTrack(room.localParticipant.videoTrackPublications.values().next().value!.videoTrack);
            setLocalVideoTrack(room.localParticipant.videoTrackPublications.values().next().value!.videoTrack);
            setLocalAudioTrack(room.localParticipant.audioTrackPublications.values().next().value!.audioTrack);
        } catch (error) {
            console.log("Error connecting to the room:", (error as Error).message);
            await leaveRoom();
        }
    }

    async function leaveRoom() {
        await room?.disconnect();
        setRoom(undefined);
        setLocalVideoTrack(undefined);
        setLocalAudioTrack(undefined);
        //setLocalTrack(undefined);
        setRemoteTracks([]);
        stopSTT(); // STT 중지
    }

    async function getToken(roomName: string, participantName: string) {
        const response = await fetch(APPLICATION_SERVER_URL + "token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomName, participantName })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to get token: ${error.errorMessage}`);
        }

        const data = await response.json();
        return data.token;
    }

    function toggleCamera() {
        if (localVideoTrack) {
            if (isCameraOn) {
                localVideoTrack.mute();
            } else {
                localVideoTrack.unmute();
            }
            setIsCameraOn(!isCameraOn);
        }
    }

    function toggleMic() {
        if (localAudioTrack) {
            if (isMicOn) {
                localAudioTrack.mute();
            } else {
                localAudioTrack.unmute();
            }
            setIsMicOn(!isMicOn);
        }
    }

    // Azure STT 실행 함수
    function startSTT() {
        if (!window.SpeechSDK || !localAudioTrack) {
            console.error("Speech SDK not loaded or local audio track missing");
            return;
        }

        const SpeechSDK = window.SpeechSDK;
        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
        speechConfig.speechRecognitionLanguage = "ko-KR";
        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

        const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
        recognizerRef.current = recognizer;

        // recognizer.recognizing = (s: any, e: any) => {
        //     console.log("Recognizing:", e.result.text);
        // };

        recognizer.recognized = (s: any, e: any) => {
            if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                console.log("Recognized:", e.result.text);
                sendSentence(e.result.text)
                //setSttResults((prev) => prev + e.result.text + "\n");
            }
        };

        recognizer.startContinuousRecognitionAsync();
    }

    // STT된 내용 서버로 전송
    var meetingId = "meeting"
    var speaker = "노영단"
    async function sendSentence(content: any) {
      const data = {
        meetingId: meetingId,
        speaker: speaker,
        content: content
      };
      try {
        const response = await fetch("http://localhost:6080/sentences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
        if (response.ok) {
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

    return (
        <>
            {!room ? (
                <div id="join">
                    <form
                        onSubmit={(e) => {
                            joinRoom();
                            e.preventDefault();
                        }}
                    >
                        <input
                            id="participant-name"
                            type="text"
                            value={participantName}
                            onChange={(e) => setParticipantName(e.target.value)}
                            required
                        />
                        <input
                            id="room-name"
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            required
                        />
                        <button type="submit">Join Room</button>
                    </form>
                </div>
            ) : (
                <div id="room">
                    <button onClick={leaveRoom}>Leave Room</button>
                    <button onClick={toggleCamera}>{isCameraOn ? "Turn Camera Off" : "Turn Camera On"}</button>
                    <button onClick={toggleMic}>{isMicOn ? "Mute Mic" : "Unmute Mic"}</button>
                    <div>
                        {localVideoTrack && (
                            <VideoComponent track={localVideoTrack} participantIdentity={participantName} local={true} />
                        )}
                        {remoteTracks.map((remoteTrack) =>
                            remoteTrack.trackPublication.kind === "video" ? (
                                <VideoComponent
                                    key={remoteTrack.trackPublication.trackSid}
                                    track={remoteTrack.trackPublication.videoTrack!}
                                    participantIdentity={remoteTrack.participantIdentity}
                                />
                            ) : (
                                <AudioComponent
                                    key={remoteTrack.trackPublication.trackSid}
                                    track={remoteTrack.trackPublication.audioTrack!}
                                />
                            )
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default OpenVidu;

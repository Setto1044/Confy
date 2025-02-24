import { useEffect, useRef } from "react";

export function useCameraStream(isOpen) {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("❌ 카메라 접근 실패", error);
      }
    }

    if (isOpen) startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  return videoRef;
}

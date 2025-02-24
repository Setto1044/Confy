import React, { useRef, useEffect } from 'react';

function CameraPreview() {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error('카메라 접근 에러:', err));

    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-video shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default CameraPreview;
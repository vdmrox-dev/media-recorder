import { useEffect, useRef } from "react";

export default function VideoPlayer({ ...props }) {
  const { muted, volume, srcObject } = props;

  const refVideo = useRef();

  useEffect(() => {
    if (refVideo.current && srcObject) {
      refVideo.current.srcObject = srcObject;
    }
  }, [srcObject]);

  return (
    <video
      autoPlay
      className="video-player"
      controls
      muted={muted}
      playsInline
      ref={refVideo}
      volume={volume}
    ></video>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";

const RecorderErrors = {
  NONE: "",
  RECORDER_ERROR: "Error on Recorder",
  NotAllowedError: "Request is not allowed by the user agent",
};

export function useReactMediaRecorder({
  audio = true,
  video = false,
  onStop = () => null,
}) {
  const mediaObject = useRef([]);
  const mediaRecorder = useRef(null);
  const mediaStream = useRef(null);

  const [status, setStatus] = useState("Idle");
  const [error, setError] = useState("NONE");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);

  const getMediaStream = useCallback(async () => {
    setStatus("Getting media stream");
    const mediaConstraints = {
      audio: typeof audio === "boolean" ? !!audio : audio,
      video: typeof video === "boolean" ? !!video : video,
    };

    try {
      const stream = await window.navigator.mediaDevices.getUserMedia(
        mediaConstraints
      );
      mediaStream.current = stream;
      setStatus("Idle");
    } catch (error) {
      setError(error.name);
      setStatus("Idle");
    }
  }, [audio, video]);

  // This verifies if there's any incompatible constraint being passed in.
  // If so, a list of the incompatible constraints and an error are displayed in console.
  useEffect(() => {
    if (!window.MediaRecorder) {
      throw new Error("Unsupported Browser");
    }

    const checkConstraints = (mediaType) => {
      const supportedMediaConstraints = navigator.mediaDevices.getSupportedConstraints();
      const unSupportedConstraints = Object.keys(mediaType).filter(
        (constraint) => !supportedMediaConstraints[constraint]
      );

      if (unSupportedConstraints.length > 0) {
        console.error(
          `Constraints not supported: '${unSupportedConstraints.join(
            ","
          )}'. Please check them out.`
        );
      }
    };

    if (typeof audio === "object") {
      checkConstraints(audio);
    }
    if (typeof video === "object") {
      checkConstraints(video);
    }
  }, [audio, video]);

  // Media Recorder Handlers

  const startRecording = async () => {
    setError("NONE");
    if (!mediaStream.current) {
      await getMediaStream();
    }
    if (mediaStream.current) {
      const hasStreamEnded = mediaStream.current
        .getTracks()
        .some((track) => track.readyState === "ended");
      if (hasStreamEnded) {
        await getMediaStream();
      }
      mediaRecorder.current = new MediaRecorder(mediaStream.current);
      mediaRecorder.current.ondataavailable = onRecordingActive;
      mediaRecorder.current.onstop = onRecordingStop;
      mediaRecorder.current.onerror = () => {
        setError("RECORDER_ERROR");
        setStatus("Idle");
      };
      mediaRecorder.current.start();
      setStatus("recording");
    }
  };

  const onRecordingActive = ({ data }) => {
    mediaObject.current.push(data);
  };

  const onRecordingStop = () => {
    const [media] = mediaObject.current;
    const blobProperty = Object.assign(
      { type: media.type },
      video ? { type: "video/mp4" } : { type: "audio/wav" }
    );
    const blob = new Blob(mediaObject.current, blobProperty);
    const url = URL.createObjectURL(blob);
    setStatus("stopped");
    setMediaBlobUrl(url);
    onStop({ url, blob });
  };

  const muteAudio = (mute) => {
    setIsAudioMuted(mute);
    if (mediaStream.current) {
      mediaStream.current
        .getAudioTracks()
        .forEach((audioTrack) => (audioTrack.enabled = !mute));
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      if (mediaRecorder.current.state !== "inactive") {
        setStatus("stopping");
        mediaRecorder.current.stop();
        mediaStream.current &&
          mediaStream.current.getTracks().forEach((track) => track.stop());
        mediaObject.current = [];
      }
    }
  };

  return {
    error: RecorderErrors[error],
    muteAudio: () => muteAudio(true),
    unMuteAudio: () => muteAudio(false),
    startRecording,
    stopRecording,
    mediaBlobUrl,
    status,
    isAudioMuted,
    previewStream: mediaStream.current
      ? new MediaStream(mediaStream.current.getVideoTracks())
      : null,
    clearBlobUrl: () => setMediaBlobUrl(null),
  };
}

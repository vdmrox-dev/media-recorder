import { useReactMediaRecorder } from "../utils";
import MediaPlayer from "./MediaPlayer";
import "../css/Buttons.css";

const RecordView = () => {
  const {
    mediaBlobUrl,
    previewStream,
    startRecording,
    status,
    stopRecording,
  } = useReactMediaRecorder({
    video: { facingMode: "environment" },
    onStop: (data) => console.log("Recording stopped! callback!", data.url, data.blob),
  });

  const renderPlayer = () => {
    if (!previewStream) return;
    if (previewStream && previewStream.active) {
      return (
        <MediaPlayer
          srcObject={previewStream}
          muted={true}
          volume={0}
          src={mediaBlobUrl}
        />
      );
    } else if (previewStream && !previewStream.active) {
      return (<video src={mediaBlobUrl} controls />)
    }
  }

  return (
    <div>
      <p>{status}</p>
      <div className="button-container">
        <button className="button" onClick={startRecording}>
          Start Rec
        </button>
        <button className="button" onClick={stopRecording}>
          Stop Rec
        </button>
      </div>
      {renderPlayer()}
    </div>
  );
};

export default RecordView;

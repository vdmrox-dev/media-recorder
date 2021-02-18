import Recorder from "./components/Recorder";
import Tabs from "./components/Tabs";
import "./css/App.css";
import "./css/Buttons.css";

function App() {

  return (
    <div className="App">
      <section>
        <Tabs>
          <div label="video">
            <p>Record video:</p>
            <Recorder recorderType="video" />
          </div>
          <div label="audio">
            <p>Record audio:</p>
            <audio controls autoPlay loop />
          </div>
        </Tabs>
      </section>
    </div>
  );
}

export default App;

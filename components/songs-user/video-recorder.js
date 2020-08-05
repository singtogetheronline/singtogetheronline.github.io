import SongState from './song-state.js';

import {
  html,
  useEffect,
  useRef,
  useState
} from "https://unpkg.com/htm/preact/standalone.module.js";

export default function VideoRecorder(props) {
  const videoRef = useRef(null);
  const backingVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [backingUrl, setBackingUrl] = useState(null);

  const [isRecording, setIsRecording] = useState(false);

  function start() {
    if (backingVideoRef.current) backingVideoRef.current.play();
    mediaRecorderRef.current.start();
    setIsRecording(true);
  }

  function stop() {
    if (backingVideoRef.current) backingVideoRef.current.load();
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  }

  useEffect(() => {
    async function getStream() {
      try {
        let stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        videoRef.current.srcObject = stream;
        let mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm; codecs=vp9"
        });
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = e => {
          let blob = new Blob([event.data], { type: "video/webm" });
          props.setBlob(blob);
          props.setSongState(SongState.PLAYBACK);
        };
      } catch (e) {
        console.log(e);
      }
    }
    getStream();
    if (props.song.video) {
      const storageRef = firebase.storage().ref();
      let u = storageRef.child(`${props.song.video}/${props.song.id}.webm`)
        .getDownloadURL().then(u => setBackingUrl(u));
    }
  }, []);
  return html`
    <div style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
      <button onclick=${e => start()} hidden="${isRecording}" >
        <i class="fa fa-circle" style="color:#f00"></i>Start Recording!
      </button>
      <div hidden="${!isRecording}" >
        <span style="color:#f00; font-weight: bold">Now Recording</span>
        <button onclick=${e => stop()} >
          <i class="fa fa-square"></i>Stop Recording
        </button>
      </div>
      
      <div style="display: flex; justify-content: center; flex-wrap: wrap;">
      <video
        ref=${videoRef}
        autoplay="true"
        muted="true"
        playsinline="true"
        width="350"
        style="border: 5px ${isRecording ? "red" : "black"} solid"
      />
      ${backingUrl?html`
        <video
          width="350"
          src="${backingUrl}"
          ref=${backingVideoRef}
          muted="true"
          playsinline="true"
          style="border: 5px black solid"
        />`:null}
      
      </div>
      
    </div>
  `;
}

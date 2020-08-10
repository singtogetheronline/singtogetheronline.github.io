import SongState from './song-state.js';
import {getVideoUrls} from '../../services/storage.js'
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
  const streamRef = useRef(null);
  const [backingUrl, setBackingUrl] = useState(null);
  const [captionsUrl, setCaptionsUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [inputMethod, setInputMethod] = useState('upload');

  useEffect(() => {
    if (inputMethod == 'record') {
      getStream()
    } else {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    }
  }, [inputMethod]);
  useEffect(() => {
    if (props.song.video) getFiles();
  }, []);

  async function getFiles() {
    const urls = await getVideoUrls(props.song);
    if (urls.video) setBackingUrl(urls.video);
    if (urls.caption) setCaptionsUrl(urls.caption);
  }

  function start() {
    if (backingVideoRef.current) backingVideoRef.current.play();
    mediaRecorderRef.current.start();
    setIsRecording(true);
  }

  function stop() {
    if (backingVideoRef.current) backingVideoRef.current.load();
    mediaRecorderRef.current.stop();
    streamRef.current.getTracks().forEach(track => track.stop());
    setIsRecording(false);
  }
  
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
      streamRef.current = stream;
      mediaRecorder.ondataavailable = e => {
        let blob = new Blob([event.data], { type: "video/webm" });
        props.setBlob(blob);
        props.setFileType('webm');
        props.setSongState(SongState.PLAYBACK);
      };
    } catch (e) {
      console.log(e);
    }
  }

  let recordStuff = html`
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
          playsinline="true"
          style="border: 5px black solid"
          crossorigin="anonymous"
        >
          ${captionsUrl?html`<track kind="subtitles" src="${captionsUrl}" default/>`:null}
        </video>`:null
      }
    </div>
  </div>
  `;
  let uploadStuff = html`
  <div style="display: flex; justify-content: center; flex-wrap: wrap;">
    ${backingUrl?html`
    <p style="width: 100%">  
    Record the video while watching this video (with headphones)
      </p>
      <video
        width="350"
        src="${backingUrl}"
        ref=${backingVideoRef}
        playsinline="true"
        style="border: 5px black solid"
        crossorigin="anonymous"
        controls
      >
        ${captionsUrl?html`<track kind="subtitles" src="${captionsUrl}" default/>`:null}
      </video>`:null
    }
  </div>
  <div class="form-group" style="width: 100%" >
    <label>Video File</label>
    <input type="file" class="form-control-file" onchange=${e => {
        props.setBlob(e.target.files[0]);
        props.setSongState(SongState.PLAYBACK);
        props.setFileType(e.target.value.split('.').pop());
      } }
    />
  </div>
  
  `;

  return html`
  <div class="form-group" style="width: 100%" >
    <label>Choose a way to submit video</label>
    <select class="form-control" onchange=${e => setInputMethod(e.target.value)} value=${inputMethod} >
      <option value="record">Record in web browser</option>
      <option value="upload">Upload video file</option>
    </select>
  </div>
  
  ${inputMethod == 'record'? recordStuff : uploadStuff }
  `;
}

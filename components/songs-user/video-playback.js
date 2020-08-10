import SongState from "./song-state.js";
import { uploadVideo } from '../../services/storage.js'

import byteSize from "https://unpkg.com/byte-size@7.0.0/index.mjs";
import {
  html,
  useState,
  useEffect
} from "https://unpkg.com/htm/preact/standalone.module.js";

export default function VideoPlayback(props) {
  const [performers, setPerformers] = useState('');
  const [url, setUrl] = useState('');
  function upload() {
    props.setSongState(SongState.UPLOADING);
    uploadVideo(props.song, props.user, performers, props.blob, props.filetype).then(() => {
      props.setSongState(SongState.UPLOADED);
    }); 
  }

  useEffect(() => {
    setUrl(URL.createObjectURL(props.blob));
  }, [props.blob])

  return html`
    <div style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
      <h2>Video Recorded!</h2>
      <div>
        <label>Performer Names</label>
        <input oninput=${e => setPerformers(e.target.value)}/>
      </div>
      File Size: ${`${byteSize(props.blob.size)}`}
      <div>
        <button onclick=${e => upload()}>Upload</button>
        <button onclick=${e => props.setSongState(SongState.RECORD)}>
          Record Again
        </button>
      </div>
      <video src="${url}" width="350" controls  />
    </div>`;
}

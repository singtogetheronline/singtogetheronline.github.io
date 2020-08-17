import SongState from "./song-state.js";
import { uploadVideo, getUserPerformers } from '../../services/storage.js'

import byteSize from "https://unpkg.com/byte-size@7.0.0/index.mjs";
import {
  html,
  useState,
  useEffect
} from "https://unpkg.com/htm/preact/standalone.module.js";

export default function VideoPlayback(props) {
  const [performers, setPerformers] = useState([]);
  const [userPerformers, setUserPerformers] = useState([]);
  const [url, setUrl] = useState('');

  useEffect(() => {
    getUserPerformers(props.user).then(p => {
      setUserPerformers(p);
      if (p.length == 1) {
        setPerformers(p);
      }
    })
  }, [url])
  
  function upload() {
    props.setSongState(SongState.UPLOADING);
    uploadVideo(props.song, props.user, performers, props.blob, props.filetype).then(() => {
      props.setSongState(SongState.UPLOADED);
    }); 
  }

  function toggle(performer) {
    const found = performers.find(p => p.id == performer.id);
    if (found) {
      setPerformers(performers.filter(p => p.id != performer.id));
    } else {
      setPerformers([...performers, performer]);
    }
  }

  useEffect(() => {
    setUrl(URL.createObjectURL(props.blob));
  }, [props.blob])

  return html`
    <div style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
      <h2>Video Recorded!</h2>
      <div>
        <label>Performers</label>
        ${userPerformers.map(p => html`
          <div><input
            type="checkbox"
            onClick=${e => toggle(p)}
            checked=${performers.find(u => u.id == p.id)}
          /> ${p.name}</div>
            `)}
      </div>
      <div>
        <button onclick=${e => upload()} disabled=${performers.length == 0} >Upload</button>
        <button onclick=${e => props.setSongState(SongState.RECORD)}>
          Record Again
        </button>
      </div>
      <video src="${url}" width="350" controls  />
    </div>`;
}

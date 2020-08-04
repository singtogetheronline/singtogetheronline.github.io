import firebase from "../../firebase.js";
import SongState from "./song-state.js";

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
    const storageRef = firebase.storage().ref();
    const db = firebase.firestore();
      db.collection("videos")
        .doc(`${props.song.id}/user/${props.user.uid}`)
        .set({
          submitter:props.user.displayName,
          performers: performers
        });
    const fileRef = storageRef.child(`${props.user.uid}/${props.song.id}.webm`);
    fileRef.put(props.blob).then(snapshot => {
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

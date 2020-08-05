import firebase from "../../firebase.js";
import {
  html,
  useEffect,
  useState,
} from "https://unpkg.com/htm/preact/standalone.module.js";

export default function SongEditor(props) {
  const [videos, setVideos] = useState([]);
  const [backingUrl, setBackingUrl] = useState(null);
  const [captionsUrl, setCaptionsUrl] = useState(null);
  const [captionText, setCaptionText] = useState(`WEBVTT

00:01.000 --> 00:04.000
Never drink liquid nitrogen.
00:05.000 --> 00:09.000
- It will perforate your stomach.
- You could die.
`);

  async function getFiles() {
    const storageRef = firebase.storage().ref();
    let videoUrl = await storageRef.child(`${props.song.video}/${props.song.id}.webm`).getDownloadURL()
    setBackingUrl(videoUrl);
    try {
      let captionUrl = await storageRef.child(`captions/${props.song.id}.vtt`).getDownloadURL()
      setCaptionsUrl(captionUrl);
      let response = await fetch(captionUrl);
      setCaptionText(await response.text());
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (props.song.video) {
      getFiles();
    }
  }, [props.song.video]);

  useEffect(() => {
    const results = [];
    const db = firebase.firestore();
    db.collection(`videos/${props.song.id}/user`)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          results.push({ ...doc.data(), id: doc.id });
        });
        setVideos(results);
      });
  }, [props.song.id])
  function onEmailChange(newValue, i) {
    let list = [...props.song.allowedEmails];
    list[i] = newValue;
    props.setSong({...props.song, allowedEmails:list});
  }
  function onRemoveEmail(i) {
    let list = props.song.allowedEmails.filter((e, j) => i!=j);
    props.setSong({...props.song, allowedEmails:list});
  }
  function onAddEmail() {
    props.setSong({...props.song, allowedEmails:[...props.song.allowedEmails, '']});
  }
  function saveSong() {
    const db = firebase.firestore();
    db.collection('songs').doc(props.song.id).set(props.song).then(() => {
      props.setSong(null);
    });
    const storageRef = firebase.storage().ref();
    const captionsRef = storageRef.child(`captions/${props.song.id}.vtt`);
    var message = captionText;
    captionsRef.putString(message).then(snapshot => {
      console.log('captions uploaded');
    });
  }
  return html`<label>Song Name</label><br/>
    <input value=${props.song.name} onchange=${e => props.setSong({...props.song, name:e.target.value})}/><br/>
    <label>Song Instructions</label><br/>
    <textarea onchange=${e => props.setSong({...props.song, description:e.target.value})}>
      ${props.song.description}
    </textarea><br/>
    <label> Assigned Email Addresses </label>
    <ul>
      ${props.song.allowedEmails.map((email, i) => 
        html`<li><input value=${email} onchange=${e => onEmailChange(e.target.value, i)}/>
        <button onclick=${e => onRemoveEmail(i)}>Remove</button></li>`)}
      <li><button onclick=${e => onAddEmail()}>Add Another</button></li>
    </ul>
    <label>Backing Video</label><br/>
    ${[...videos, {id:null, submitter:'None'}].map(v => html`
      <input
        type="radio"
        name="videoSelect"
        onchange=${e=> {
          if (e.target.checked) props.setSong({...props.song, video:v.id})
        }}
        ...${props.song.video==v.id?{checked:true}:{}}
      />
      <label>${v.submitter}</label><br/>`)}
    <textarea onchange=${e => setCaptionText(e.target.value)} style="width: 350px; height: 300px;" >
      ${captionText}
    </textarea><br/>
    <button onclick=${e=> saveSong()}>Save</button>
    <button onclick=${e=> props.setSong(null)}>Cancel</button> <br/>
    ${backingUrl?html`
      <video width="350" src="${backingUrl}" controls crossorigin="anonymous">
        ${captionsUrl?html`<track kind="subtitles" src="${captionsUrl}" default/>`:null}
      </video>`:null}
      
    `
}
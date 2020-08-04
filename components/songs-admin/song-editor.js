import firebase from "../../firebase.js";
import {
  html,
  useEffect,
  useState,
} from "https://unpkg.com/htm/preact/standalone.module.js";

export default function SongEditor(props) {
  const [videos, setVideos] = useState([])
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
    })
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
    <button onclick=${e=> saveSong()}>Save</button>
    <button onclick=${e=> props.setSong(null)}>Cancel</button>`
}
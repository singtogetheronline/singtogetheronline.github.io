import firebase from "../../firebase.js";
import {
  html,
  useEffect,
  useState,
} from "https://unpkg.com/htm/preact/standalone.module.js";
import SongEditor from "./song-editor.js";

export default function SongListEditor(props) {
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState(null);
  useEffect(() => {
    if (song == null) {
      const results = [];
      const db = firebase.firestore();
      db.collection("songs")
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            results.push({...doc.data(), id:doc.id});
          });
          setSongs(results);
        });
    }
  }, [song])

  function newSong() {
    let s = {
      name: 'Untitled',
      description: 'Instructions for singing',
      allowedEmails: []
    };
    const db = firebase.firestore();
    db.collection("songs").add(s).then(d => {
        setSong({...s, id:d.id});
    });
  }
  if (song) {
    return html`<${SongEditor} user=${props.user} song=${song} setSong=${setSong}/>`;
  }
  return html`
    <h3>Manage Songs</h3>
    <ul>
      ${songs.map(song => html`<li><a href="#" onclick=${e => setSong(song)}>${song.name}</a></li>`)}
      <li><a href="#" onclick=${e => newSong()}>New Song</a></li>
    </ul>`;
} 
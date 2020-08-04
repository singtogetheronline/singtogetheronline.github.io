import firebase from "../../firebase.js";
import SongState from './song-state.js';
import {
  html,
  useEffect,
  useState
} from "https://unpkg.com/htm/preact/standalone.module.js";

export default function SongList(props) {
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    const results = [];
    const db = firebase.firestore();
    db.collection("songs")
      .where('allowedEmails', 'array-contains', props.user.email)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          results.push({...doc.data(), id:doc.id});
        });
        setSongs(results);
      });
  }, [])

  function setSong(song) {
    props.setSong(song);
    props.setSongState(SongState.INSTRUCTIONS);
  }
  
  return html`
    <h2>Assigned Song List</h2>
    <ul>
      ${songs.map(song => html`<li><a href="#" onclick=${e => setSong(song)}>${song.name}</a></li>`)}
    </ul>`;
}


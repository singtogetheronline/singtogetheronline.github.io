import SongState from './song-state.js';
import {getMySongs} from '../../services/storage.js';
import {
  html,
  useEffect,
  useState
} from "https://unpkg.com/htm/preact/standalone.module.js";

export default function SongList(props) {
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    getMySongs(props.user).then(results => setSongs(results));
  }, [])

  function setSong(song) {
    props.setSong(song);
    props.setSongState(SongState.INSTRUCTIONS);
  }
  
  return html`
    <h2>Primary Program Assignments</h2>
    <ul>
      ${songs.map(song => html`<li><a href="#" onclick=${e => setSong(song)}>${song.name}</a></li>`)}
    </ul>`;
}


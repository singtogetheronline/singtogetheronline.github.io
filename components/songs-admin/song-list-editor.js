import {getAllSongs, createSong, deleteSong} from '../../services/storage.js';

import {
  html,
  useEffect,
  useState,
} from "https://unpkg.com/htm/preact/standalone.module.js";
import SongEditor from "./song-editor.js";
import Performers from './performers.js';

export default function SongListEditor(props) {
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState(null);
  const [performers, setPerformers] = useState([]);
  
  useEffect(() => {
    if (song == null) {
      getAllSongs(props.org).then(results => setSongs(results));
    }
  }, [song, props.org]);

  function removeSong(song) {
    deleteSong(song).then(() => {
      getAllSongs(props.org).then(results => setSongs(results));
    })
  }

  function newSong() {
    let s = {
      name: 'Untitled',
      description: 'Instructions for singing',
      allowedEmails: [],
      org: props.org
    };
    createSong(s).then(d => setSong({...s, id:d.id}));
  }
  if (song) {
    return html`<${SongEditor} user=${props.user} song=${song} setSong=${setSong} performers=${performers} />`;
  }
  return html`
    <h3>Manage Songs</h3>
    <ul>
      ${songs.map(song => html`
        <li>
          <a href="#" onclick=${e => setSong(song)}>${song.name}</a>
          <a href="#" onclick=${e => removeSong(song)}> <i class="fas fa-trash-alt trash-icon"></i></a>
        </li>`)}
      <li><a href="#" onclick=${e => newSong()}>New Song</a></li>
    </ul>
    <${Performers} performers=${performers} setPerformers=${setPerformers} org=${props.org} />
    `;
}
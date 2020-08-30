import {getAllSongs, createSong, deleteSong} from '../../services/storage.js';

import {
  html,
  useEffect,
  useState,
} from "https://unpkg.com/htm/preact/standalone.module.js";
import AdminState from './admin-state.js';

export default function SongListEditor(props) {
  const [songs, setSongs] = useState([]);
  
  useEffect(() => {
      getAllSongs(props.org).then(results => setSongs(results));
  }, [props.song, props.org]);

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
    createSong(s).then(d => {
      props.setSong({...s, id:d.id});
      props.setAdminState(AdminState.EDIT_SONG);
    });
  }
  return html`
    <h3>Songs</h3>
    <ul>
      ${songs.map(song => html`
        <li>
          <a href="#" onclick=${e => {
            props.setSong(song);
            props.setAdminState(AdminState.EDIT_SONG);
          }}>${song.name}</a>
          <a href="#" onclick=${e => removeSong(song)}> <i class="fas fa-trash-alt trash-icon"></i></a>
        </li>`)}
      <li><a href="#" onclick=${e => newSong()}>New Song</a></li>
    </ul>
    `;
}
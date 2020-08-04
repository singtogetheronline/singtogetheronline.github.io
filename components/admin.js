import firebase from "../firebase.js";
import {
  html,
  useEffect,
  useState,
  render
} from "https://unpkg.com/htm/preact/standalone.module.js";
import SongListEditor from './songs-admin/song-list-editor.js';

function Admin() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => setUser(user));
  }, []);

  if (user === null) {
    return html`
        <button
          onclick=${e => {
        window.location.href = "./signin.html";
      }}
        >
          Sign In
        </button>
      `;
  }
  return html`
      <button onclick=${e => firebase.auth().signOut()}>Sign Out</button>
      <h2>Hello, ${user.displayName}</h2>
      <${SongListEditor} user=${user}/>`;

}
render(
  html`<${Admin} />`,
  document.querySelector("body")
);

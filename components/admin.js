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

  let signInOut;
  if (user === null) {
    signInOut = html`
      <button onclick=${e => {window.location.href = "./signin.html";}}>
        Sign In
      </button>
    `;
  } else {
    signInOut = html`
      ${user.displayName}
      <button class="signOutBtn" onclick=${e => firebase.auth().signOut()}>Sign Out</button>
    `;
  }
  return html`
  <div class="topbar">
    <i class="fas fa-place-of-worship fa-2x corner-logo"></i>
    <h2 class="title"> Old Settlers Virtual Primary Program </h2>
    <div class="signInOut">
        ${signInOut}
    </div>
  </div>
  <div class="mainBody">
    <div class="mainCenter">
      ${user ? html`<${SongListEditor} user=${user} />` : 'Sign in to see what songs are assigned to you'}
    </div>
  </div>`;

}
render(
  html`<${Admin} />`,
  document.querySelector("body")
);

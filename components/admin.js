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
  const [org, setOrg] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setUser(user);
      if (user) {
        user.getIdTokenResult().then(idTokenResult => setOrg(idTokenResult.claims.org));
      }
    });
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
    <a href="/"><i class="fas fa-place-of-worship fa-2x corner-logo"></i></a>
    <h2 class="title"> Virtual Primary Program Admin</h2>
    <div class="signInOut">
        ${signInOut}
    </div>
  </div>
  <div class="mainBody">
    <div class="mainCenter">
      ${user ? html`<${SongListEditor} user=${user} org=${org} />` : 'Sign in to see what songs are assigned to you'}
    </div>
  </div>`;
}
render(
  html`<${Admin} />`,
  document.querySelector("body")
);

import firebase from "../firebase.js";
import SongHandler from './songs-user/song-handler.js';

import {
  html,
  useEffect,
  useState,
  render
} from "https://unpkg.com/htm/preact/standalone.module.js";

function Main() {
  const [user, setUser] = useState(null);
  const [org, setOrg] = useState(null);
  
  useEffect(() => {
    console.log(window.Modernizr)
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
      <h2 class="title"> Virtual Primary Program </h2>
      <div class="signInOut">
        ${org && html`<a class="admin-link" href="/admin.html">Admin Panel</a>`}
        ${signInOut}
      </div>
    </div>
    <div class="mainBody">
        ${user ? html`<${SongHandler} user=${user} />` : html`
        <div class="mainCenter"><a href="./signin.html">Create an account or sign in</a> to see what songs are assigned to you</div>`}
    </div>
  `;
}
render(
  html`<${Main} />`,
  document.querySelector("body")
);

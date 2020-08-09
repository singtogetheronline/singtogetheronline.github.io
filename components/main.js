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
    ${ user ? html`
      <ul class="nav nav-pills nav-fill">
        <li class="nav-item">
          <a class="nav-link disabled active" href="#">Assigned Songs</a>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="#">Instructions</a>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="#">Record</a>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="#">Upload</a>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="#">Complete</a>
        </li>
      </ul>`: null }
      <div class="mainCenter">
        ${user ? html`<${SongHandler} user=${user} />` : 'Sign in to see what songs are assigned to you'}
      </div>
    </div>
  `;
}
render(
  html`<${Main} />`,
  document.querySelector("body")
);

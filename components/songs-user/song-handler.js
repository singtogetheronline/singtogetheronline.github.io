import SongState from './song-state.js';
import {stateOrder} from './song-state.js';

import SongList from './song-list.js';
import VideoRecorder from './video-recorder.js';
import {MarkdownIt} from "https://cdn.jsdelivr.net/gh/JCloudYu/esm.markdown-it@8/esm.markdown-it.esm.js";

import {
  html,
  useState,
  useRef,
  useEffect
} from "https://unpkg.com/htm/preact/standalone.module.js";
import VideoPlayback from './video-playback.js';

const markdown = new MarkdownIt();

function NavItem(props) {
  let disabled = '';
  if (stateOrder[props.songState] <= stateOrder[props.state]) {
    disabled = 'disabled';
  }
  let active = '';
  if (props.songState == props.state) active = 'active';
  return html`
    <li class="nav-item">
      <a
        class="nav-link ${disabled} ${active}"
        href="#"
        onclick=${e => props.setSongState(props.state)}
      >
        ${props.displayName}
      </a>
    </li>`;
}

function NavBar(props) {
  
  return html`
    <ul class="nav nav-pills nav-fill">
      <${NavItem}
        displayName="Assignments"
        state=${SongState.SELECT}
        songState=${props.songState}
        setSongState=${props.setSongState}
      />
      <${NavItem}
        displayName="Instructions"
        state=${SongState.INSTRUCTIONS}
        songState=${props.songState}
        setSongState=${props.setSongState}
      />
      <${NavItem}
        displayName="Record"
        state=${SongState.RECORD}
        songState=${props.songState}
        setSongState=${props.setSongState}
      />
      <${NavItem}
        displayName="Upload"
        state=${SongState.PLAYBACK}
        songState=${props.songState}
        setSongState=${props.setSongState}
      />  
    </ul>`
}

export default function SongHandler(props) {
  const [song, setSong] = useState(null);
  const [songState, setSongState] = useState(SongState.SELECT);
  const [blob, setBlob] = useState(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    if (descriptionRef.current)
      descriptionRef.current.innerHTML = markdown.render(song.description);
  })

  function selectSubComponent() {
    if (songState === SongState.SELECT) {
      return html`
        <${SongList}
          user=${props.user}
          setSong=${setSong}
          setSongState=${setSongState}
        />`;
    }
    if (songState === SongState.INSTRUCTIONS) {
      return html`
          <h2 style="text-align: center;">${song.name}</h2>
          <div ref=${descriptionRef} ></div>
          <button onclick=${e => setSongState(SongState.RECORD)}>Record Video</button>
        `;
    }
    if (songState === SongState.RECORD) {
      return html`
        <${VideoRecorder}
          song=${song}
          setBlob=${setBlob}
          setSongState=${setSongState}
        />
        `;
    }
    if (songState === SongState.PLAYBACK) {
      return html`
        <${VideoPlayback}
          blob=${blob}
          setSongState=${setSongState}
          user=${props.user}
          song=${song}
        />`; 
    }
    if (songState ===SongState.UPLOADING) {
      return html`<h2> Uploading...</h2>`;
    }
    if (songState === SongState.UPLOADED) {
      return html`
        Video Uploaded Successfully. <br/>
          <button onclick=${e => setSongState(SongState.RECORD)}>Record Again</button>
          <button onclick=${e => setSongState(SongState.SELECT)}>Back to Song List</button>
        `;
    }
  }
  return html`
    <${NavBar} songState=${songState} setSongState=${setSongState} />
    <div class="mainCenter">
      ${selectSubComponent()}
    </div>`;
    
  

  
  
  
  
}


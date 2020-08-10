import {stateOrder} from './song-state.js';
import SongState from './song-state.js';
import {html} from "https://unpkg.com/htm/preact/standalone.module.js";


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
  
export default function NavBar(props) {
    
    return html`
      <ul class="nav nav-pills nav-fill">
        <${NavItem}
          displayName="Songs"
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
  
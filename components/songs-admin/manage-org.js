import {
  html,
  useEffect,
  useState
} from "https://unpkg.com/htm/preact/standalone.module.js";
import SongListEditor from './song-list-editor.js';
import Performers from './performers.js';
import SongEditor from './song-editor.js';
import ExportSong from './export-song.js';
import BreadCrumbNav from "../breadcrumb-nav.js";
import AdminState, { adminBreadCrumbs } from "./admin-state.js";

export default function ManageOrg(props) {
  const [song, setSong] = useState(null);
  const [adminState, setAdminState] = useState(AdminState.MANAGE_ORG);
  const [performers, setPerformers] = useState([]);

  let body = {}
  body[AdminState.MANAGE_ORG] = html`
    <${SongListEditor}
      org=${props.org}
      setSong=${setSong}
      setAdminState=${setAdminState} />
    <${Performers}
      performers=${performers}
      setPerformers=${setPerformers}
      org=${props.org} />`;
  body[AdminState.EDIT_SONG] = html`
    <${SongEditor}
      song=${song}
      setSong=${setSong}
      setAdminState=${setAdminState}
      performers=${performers} />`;
  body[AdminState.EXPORT] = html`
    <${ExportSong}
      org=${props.org}
      performers=${performers}
      song=${song} />`;
  return html`
    <${BreadCrumbNav} currentState=${adminState} setState=${setAdminState} navItems=${adminBreadCrumbs}/>
    <div class="mainCenter">
      ${body[adminState]}
    </div>`;
}
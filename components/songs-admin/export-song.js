const { createFFmpeg } = window.FFmpeg;
import {
  html,
  useEffect,
  useState
} from "https://unpkg.com/htm/preact/standalone.module.js";
import { getVideos, getVideoUrl } from "../../services/storage.js";

export default function ExportSong(props) {
  const [ffmpeg, setFfmpeg] = useState(null);
  const [videoUrls, setVideoUrls] = useState([]);

  async function getVideoUrls() {
    const vids = await getVideos(props.song);
    setVideoUrls(await Promise.all(vids.map(v => getVideoUrl(props.song, v))));
  }
  
  useEffect(() => getVideoUrls(), [props.song.id]);
  
  useEffect(() => {
    const ffmpeg = createFFmpeg({ log: true });
    ffmpeg.load().then(() => {
      setFfmpeg(ffmpeg);
    });
  }, []);

  async function downloadVideo(video) {
    let response = await fetch(video.url);
    let url = URL.createObjectURL(await response.blob());
    const a = document.createElement('a');
    a.href = url;
    a.download = video.performers.map(v => v.name).join(', ')+'.'+video.filetype;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  let mixer;
  if (ffmpeg) {
    mixer = null;
  } else {
    mixer = html`
      Loading...
      <div class="progress" style="width:100%">
        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 100%"></div>
      </div>
    `;
  }

  return html`
    <h3> Download Videos </h3>
    <ul>
      ${videoUrls.map(v => html`
        <li><a href="#" onclick=${e => downloadVideo(v)} > ${v.performers?.map(p => p.name)?.join(', ')}</a></li>
      `)}
    </ul>
    <h3> Audio/Video Mixer </h3>
    ${mixer}`;
}
const { createFFmpeg } = window.FFmpeg;
import {
  html,
  useEffect,
  useState
} from "https://unpkg.com/htm/preact/standalone.module.js";
import { getVideos, getVideoUrl, updateVideoInfo } from "../../services/storage.js";
const WaveformPlaylist = window.waveformPlaylist.default;

export default function ExportSong(props) {
  const [ffmpeg, setFfmpeg] = useState(null);
  const [videoUrls, setVideoUrls] = useState([]);
  const [haveVids, setHaveVids] = useState(false);
  
  useEffect(() => getVideoUrls(), [props.song.id]);
  useEffect(() => {
    //loadFfmpeg
  }, []);
  useEffect(() => {
    if (haveVids) initWaveForms();
  }, [haveVids]);

  function loadFfmpeg() {
    const ffmpeg = createFFmpeg({ log: true });
    ffmpeg.load().then(() => {
      setFfmpeg(ffmpeg);
    });
  }
  
  async function getVideoUrls() {
    const vids = await getVideos(props.song);
    setVideoUrls(await Promise.all(vids.map(v => getVideoUrl(props.song, v))));
    setHaveVids(true);
  }
  function initWaveForms() {
    var playlist = WaveformPlaylist({
      samplesPerPixel: 3000,
      mono: true,
      waveHeight: 150,
      container: document.getElementById("waveform"),
      state: "cursor",
      colors: {
        waveOutlineColor: "#E0EFF1",
        timeColor: "grey",
        fadeColor: "black"
      },
      controls: {
        show: true,
        width: 200
      },
      zoomLevels: [500, 1000, 3000, 5000]
    });
    
    playlist
  .load(videoUrls.map(v => ({src: v.url, name: performerNames(v) })))
  }
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

  function performerNames(video) {
    return video.performers?.map(p => p.name)?.join(', ')
  }

  function excludeChange(video) {
    video.exclude = !video.exclude;
    updateVideoInfo(props.song, video);
    setVideoUrls(videoUrls.map(v => (v.id == video.id)?video:v))
  }

  return html`
    <h3> Download Videos </h3>
    <ul>
      ${videoUrls.map(v => html`
        <li><a href="#" onclick=${e => downloadVideo(v)} > ${performerNames(v)}</a></li>
      `)}
    </ul>
    <h3> Waveform </h3>
    <div id=waveform style="width:100%; height: 700px" ></div>
    
    <h3> Audio/Video Mixer </h3>
    ${!ffmpeg && html`
      Loading...
      <div class="progress" style="width:100%">
        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 100%"></div>
      </div>`
    }
    `;
}
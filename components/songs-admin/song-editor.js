import {saveSong, getVideos, getVideoUrls, getAllPerformers} from '../../services/storage.js';
import {
  html,
  useEffect,
  useState,
  useRef
} from "https://unpkg.com/htm/preact/standalone.module.js";

const exampleCaptions = `WEBVTT

00:01.000 --> 00:04.000
These are example song lyrics
00:05.000 --> 00:09.000
It will be updated when you save.
`

export default function SongEditor(props) {
  const [videos, setVideos] = useState([]);
  const [assignedPerformers, setAssignedPerformers] = useState([]);
  const [backingUrl, setBackingUrl] = useState(null);
  const [captionsUrl, setCaptionsUrl] = useState(null);
  const [captionText, setCaptionText] = useState(exampleCaptions);
  const selectRef = useRef(null);

  useEffect(() => {
    if (props.song.performers) {
      setAssignedPerformers(props.song.performers);
    } else {
      setAssignedPerformers([]);
    }
  }, props.song.performers);

  async function getFiles() {
    const urls = await getVideoUrls(props.song);
    setBackingUrl(urls.video);
    setCaptionsUrl(urls.caption);
    if (urls.caption) {
      let response = await fetch(urls.caption);
      setCaptionText(await response.text());
    }
  }

  useEffect(() => {
    const newVal = assignedPerformers.map(p => p.id);
    if (selectRef.current) {
      selectRef.current.setValue(newVal, true);
    }
    const emails = assignedPerformers.reduce((acc, p) => acc.concat([p.email, p.otherEmail]), []);
    props.setSong({
      ...props.song,
      performers:assignedPerformers,
      allowedEmails: emails.filter(e => e !== '')
    });
  }, [assignedPerformers]);
  
  useEffect(() => {
    if (props.song.video) getFiles()
  }, [props.song.video]);

  useEffect(() => {
    const select = $('#performerSelect').selectize({
      allowEmptyOption: true,
      maxItems: null,
      items: [],
      onChange: assignedIds => {
        const foundPerformers = props.performers.filter(p => assignedIds.includes(p.id));
        setAssignedPerformers(foundPerformers);
      }
    });
    selectRef.current = select[0].selectize;
  }, [props.performers]);

  useEffect(() => getVideos(props.song).then((videos) => setVideos(videos)), [props.song.id]);
  
  function saveSongInfo() {
    saveSong(props.song, captionText).then(()=> {
      props.setSong(null);
    });
  }

  return html`
  <div style="width: 100%;">
  <label>Song Name</label><br/>
    <input value=${props.song.name} onchange=${e => props.setSong({...props.song, name:e.target.value})}/><br/>
    <label>Song Instructions</label><br/>
    <textarea style="height: 150px; width: 100%" onchange=${e => props.setSong({...props.song, description:e.target.value})}>
      ${props.song.description}
    </textarea><br/>
    <div class="control-group">
					<label for="perfomerSelect">Assigned Performers:</label>
          <select
            id="performerSelect"
            class="demo-default"
            data-placeholder="Select performers..."
            onchange=${e=> console.log(e.target.value)}
          >
						${props.performers.map(performer => html`<option value="${performer.id}">${performer.name}</option>`)}
					</select>
				</div>
    <label>Backing Video</label><br/>
    ${[...videos, {id:null, submitter:'None'}].map(v => html`
      <input
        type="radio"
        name="videoSelect"
        onchange=${e=> {
          if (e.target.checked) props.setSong({...props.song, video:v})
        }}
        ...${props.song.video?.id == v.id? { checked: true }:{}}
      />
      <label>${v.submitter}</label><br/>`)}
    <label>Subtitles</label><br/>
    <textarea onchange=${e => setCaptionText(e.target.value)} style="width: 100%; height: 200px;" >
      ${captionText}
    </textarea><br/>
    <button onclick=${e=> saveSongInfo()}>Save</button>
    <button onclick=${e=> props.setSong(null)}>Cancel</button> <br/>
    ${backingUrl?html`
      <video width="350" src="${backingUrl}" controls crossorigin="anonymous">
        ${captionsUrl?html`<track kind="subtitles" src="${captionsUrl}" default/>`:null}
      </video>`:null}
    </div>
    `
}
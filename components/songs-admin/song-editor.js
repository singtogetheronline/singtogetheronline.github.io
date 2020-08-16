import {saveSong, getVideos, getVideoUrls} from '../../services/storage.js';
import {
  html,
  useEffect,
  useState,
} from "https://unpkg.com/htm/preact/standalone.module.js";

export default function SongEditor(props) {
  const [videos, setVideos] = useState([]);
  const [backingUrl, setBackingUrl] = useState(null);
  const [captionsUrl, setCaptionsUrl] = useState(null);
  const [captionText, setCaptionText] = useState(`WEBVTT

00:01.000 --> 00:04.000
These are example song lyrics
00:05.000 --> 00:09.000
It will be updated when you save.
`);

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
    if (props.song.video) getFiles()
  }, [props.song.video]);

  useEffect(() => getVideos(props.song).then((videos) => setVideos(videos)), [props.song.id]);

  function onEmailChange(newValue, i) {
    let list = [...props.song.allowedEmails];
    list[i] = newValue;
    props.setSong({...props.song, allowedEmails:list});
  }
  function onRemoveEmail(i) {
    let list = props.song.allowedEmails.filter((e, j) => i!=j);
    props.setSong({...props.song, allowedEmails:list});
  }
  function onAddEmail() {
    props.setSong({...props.song, allowedEmails:[...props.song.allowedEmails, '']});
  }
  
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
    <label> Assigned Email Addresses </label>
    <ul>
      ${props.song.allowedEmails.map((email, i) => 
        html`<li><input value=${email} onchange=${e => onEmailChange(e.target.value, i)}/>
        <button onclick=${e => onRemoveEmail(i)}>Remove</button></li>`)}
      <li><button onclick=${e => onAddEmail()}>Add Another</button></li>
    </ul>
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
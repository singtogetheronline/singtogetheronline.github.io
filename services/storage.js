import firebase from "../firebase.js";

export async function getVideos(song) {
  const results = [];
  const db = firebase.firestore();
  let snapshot = await db.collection(`videos/${song.id}/user`).get();
  snapshot.forEach(doc => {
    results.push({ ...doc.data(), id: doc.id });
  });
  return results;
}

export async function getVideoUrls(song) {
  const ret = {};
  const storageRef = firebase.storage().ref();
  ret.video = await storageRef.child(`${song.video.id}/${song.id}.${song.video.filetype}`).getDownloadURL();
  try {
    ret.caption = await storageRef.child(`captions/${song.id}.vtt`).getDownloadURL();
  } catch (e) {
    console.log(e);
  }
  return ret;
}

export function saveSong(song, captionText) {
  const storageRef = firebase.storage().ref();
  const captionsRef = storageRef.child(`captions/${song.id}.vtt`);
  captionsRef.putString(captionText).then(() => {
    console.log('captions successfully uploaded');
  });
  const db = firebase.firestore();
  return db.collection('songs').doc(song.id).set(song)
}

export function uploadVideo(song, user, performers, blobOrFile, filetype) {
  const storageRef = firebase.storage().ref();
    const db = firebase.firestore();
      db.collection("videos")
        .doc(`${song.id}/user/${user.uid}`)
        .set({
          submitter:user.displayName,
          performers: performers,
          filetype: filetype
        });
    const fileRef = storageRef.child(`${user.uid}/${song.id}.${filetype}`);
    return fileRef.put(blobOrFile);
}

export async function getMySongs(user) {
  const results = [];
  const db = firebase.firestore();
  const snapshot = await db.collection("songs")
    .where('allowedEmails', 'array-contains', user.email)
    .get();
  snapshot.forEach(doc => {
    results.push({...doc.data(), id:doc.id});
  });
  return results;
}

export async function getAllSongs() {
  const results = [];
  const db = firebase.firestore();
  const snapshot = await db.collection("songs")
    .get();
  snapshot.forEach(doc => {
    results.push({...doc.data(), id:doc.id});
  });
  return results;
}

export async function createSong(song) {
  const db = firebase.firestore();
  return db.collection("songs").add(song);
}
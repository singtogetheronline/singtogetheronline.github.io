import firebase from "../firebase.js";

export async function getVideos(song) {
  const results = [];
  const db = firebase.firestore();
  let snapshot = await db.collection(`videos/${song.id}/performers`).get();
  snapshot.forEach(doc => {
    results.push({ ...doc.data(), id: doc.id });
  });
  return results;
}

export async function getAllPerformers(org) {
  const results = []
  const db = firebase.firestore();
  let snapshot = await db.collection('performers')
    .where('org', '==', org)
    .get();
  snapshot.forEach(doc => {
    results.push({...doc.data(), id:doc.id});
  });
  return results;
}

export async function createPerformer(performer) {
  const db = firebase.firestore();
  return db.collection('performers').add(performer);
}

export async function deletePerformer(performer) {
  const db = firebase.firestore();
  return db.collection('performers').doc(performer.id).delete()
}

export async function deleteSong(song) {
  const db = firebase.firestore();
  return db.collection('songs').doc(song.id).delete();
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

export function savePerformer(performer) {
  const db = firebase.firestore();
  return db.collection('performers').doc(performer.id).set(performer);
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
  const performerId = performers.map(p => p.id).join('_');
  const storageRef = firebase.storage().ref();
  const db = firebase.firestore();
  db.collection("videos")
    .doc(`${song.id}/performers/${performerId}`)
    .set({
      id: performerId,
      submitter:user.displayName,
      performers: performers,
      filetype: filetype
    });
  const fileRef = storageRef.child(`${song.id}/${performerId}.${filetype}`);
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

export async function getAllSongs(org) {
  const results = [];
  const db = firebase.firestore();
  const snapshot = await db.collection("songs")
    .where('org', '==', org)
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
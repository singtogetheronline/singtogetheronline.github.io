const firebase = window.firebase;

const firebaseConfig = {
    apiKey: "AIzaSyAaacNmnk6xqxxBtlUb9wI7X9bW4RrN5E8",
    authDomain: "oldsettlersprimary.firebaseapp.com",
    databaseURL: "https://oldsettlersprimary.firebaseio.com",
    projectId: "oldsettlersprimary",
    storageBucket: "oldsettlersprimary.appspot.com",
    messagingSenderId: "461212066970",
    appId: "1:461212066970:web:b881225ccbe72e8ba82b23"
};
firebase.initializeApp(firebaseConfig);

export default firebase;
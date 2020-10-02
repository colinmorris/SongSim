import * as firebase from 'firebase/app';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyArNJ3oSIk8Y3xPRqAL_0y4hZDwtwcHJ7Q",
  authDomain: "songsim-99de9.firebaseapp.com",
  databaseURL: "https://songsim-99de9.firebaseio.com",
  storageBucket: "songsim-99de9.appspot.com",
  messagingSenderId: "845644117075"
};

const SONG_PREFIX = '/songs/';
//const SONG_PREFIX = '/songsTest/';

class DBHelper {

  constructor() {
    this.loaded = false;
  }

  get db() {
    // Lazy load this to avoid making unnecessary requests (I assume initialization
    // involves network, but I could be wrong)
    if (!this.loaded) {
      firebase.initializeApp(config);
      this._db = firebase.database();    
      this.loaded = true;
    }
    return this._db;
  }

  load(key) {
    return this.db.ref(SONG_PREFIX + key).once('value');
  }

  push(verse) {
    var newVerseRef = this.db.ref(SONG_PREFIX).push();
    newVerseRef.set(verse.raw);
    return newVerseRef;
  }
}

export default DBHelper;

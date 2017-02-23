import React, { Component } from 'react';

import Matrix from './Matrix.js';
import LyricsPane from './LyricsPane.js';
import SongSelector from './SongSelector.js';
import {CustomVerse, CannedVerse} from './verse.js';
import {NOINDEX, MODE} from './constants.js';
import LANDING_LYRICS from './landing_lyrics.js';
import config from './config.js';
import DBHelper from './firebasehelper.js';

class Songsim extends Component {
  constructor(props) {
    super(props);
    this.db = new DBHelper();
    var verse = this.getVerse(this.props.songId);
    this.state = {verse: verse,
      matrix_focal: {x: NOINDEX, y: NOINDEX},
      lyrics_focal: NOINDEX,
      mode: config.default_mode,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.songId === nextProps.songId) {
      return;
    }
    // new songid
    var verse = this.getVerse(nextProps.songId);
    // TODO: hack
    if (verse.text !== "loading") {
      this.setState({verse: verse});
    }
  }

  
  getVerse(songId) {
    if (!songId) {
      // No song id in the URL. Return the default landing song.
      return new CannedVerse(LANDING_LYRICS, "Buddy Holly", "buddyholly"); // TODO: constants
    }
    // We have a song id in the URL. We're going to have to perform a request
    // to get the text. Until that happens, just return a placeholder.
    // TODO: should handle this more gracefully. e.g. define an isLoading state
    // variable, and when it's true, hold off on rendering the matrix/lyrics
    // stuff, and just show some kind of "loading" animation
    var canned = SongSelector.lookupCanned(songId);
    if (canned) {
      SongSelector.loadSong(this.onTextChange, canned);
    } else {
      // Okay, it's a firebase key
      console.log(`Looking up firebase key ${songId}`);
      this.db.load(songId).then( (snapshot) => {
        var txt = snapshot.val();
        var verse = new CustomVerse(txt, "", songId);
        this.onTextChange(verse);
      });
    }
    return new CannedVerse("loading");
  }

  onTextChange = (verse) => {
    this.setState({verse: verse});
  }

  onModeChange = (e) => {
    this.setState({mode: e.target.value});
  }

  makePermalink = () => {
    console.assert(!this.state.verse.id);
    var ref = this.db.push(this.state.verse);
    console.log(ref);
    console.log(`Url = ${ref.toString()}`);
    console.log(`key = ${ref.key}`);
    this.state.verse.id = ref.key;
  }

  get focal_rowcols() {
    if (!config.alleys) {
      return [undefined, undefined];
    }
    if (this.state.lyrics_focal !== NOINDEX) {
      var thing = [this.state.lyrics_focal, this.state.lyrics_focal];
      return [thing, thing];
    }
    if (this.state.matrix_focal.x !== NOINDEX) {
      var diag = this.focal_local_diag;
      return [diag.yrange, diag.xrange];
    }
    return [undefined, undefined];
  }

  get focal_local_diag() {
    if (this.state.matrix_focal.x === NOINDEX) {
      return undefined;
    }
    var matrix = this.state.verse.matrix;
    return matrix.local_diagonal(
        this.state.matrix_focal.x, 
        this.state.matrix_focal.y
    );
  }

  /** Return a map of diagonals to labels
   */
  get focal_diags() {
    var foc = new Map();
    if (this.state.matrix_focal.x === NOINDEX) {
      return foc;
    }
    // this is kinda dumb but whatever
    var seen = new Set();
    var add = (diag, label) => {
      let k = diag.key;
      if (!seen.has(k)) {
        foc.set(diag, label);
        seen.add(k);
      }
    }
    var primary = this.focal_local_diag;
    add(primary, 'primary');
    for (let correl of primary.mainCorrelates()) {
      add(correl, 'primary-maindiag');
    }
    for (let correl of this.state.verse.matrix.incidental_correlates(primary)) {
      add(correl, 'incidental');
    }
    return foc;
  }

  get lyrics_highlights() {
    var hl = new Map();
    if (this.state.lyrics_focal !== NOINDEX) {
      hl.set(this.state.lyrics_focal, 'focal');
    } else if (this.state.matrix_focal.x !== NOINDEX) {
      // Focal rect
      hl.set(this.state.matrix_focal.x, 'focal');
      hl.set(this.state.matrix_focal.y, 'focal');
      // This is lazy, but should basically work for now
      for (let [diag, strength] of this.focal_diags) {
        for (let [x, _y] of diag.points()) {
          if (!hl.has(x)) {
            hl.set(x, strength);
          }
        }
      }
    }
    return hl;
  }

  matrix_hover_cb = (pt) => {
    this.setState({matrix_focal: pt})
  }

  renderRadio = (mode_key) => {
    var mode = MODE[mode_key];
    return (<label key={mode}><input type="radio" 
              checked={this.state.mode === mode}
              value={mode}
              onChange={this.onModeChange}
              name="mode" />
              {mode}
              </label>
    );
  }

  render() {
    var rowcols = this.focal_rowcols;
    var rows = rowcols[0], cols = rowcols[1];
    var radios = Object.keys(MODE).map(this.renderRadio)
    return (
        <div>

        <SongSelector 
          onSelect={this.onTextChange} 
          selectedTitle={this.state.verse.title}
        />

        <div className="row">
          <div className="col-xs-8">
            <Matrix 
              matrix={this.state.verse.matrix} 
              verse={this.state.verse} 
              hover_cb={this.matrix_hover_cb}
              focal_rows={rows}
              focal_cols={cols}
              matrix_focal={this.state.matrix_focal}
              lyrics_focal={this.state.lyrics_focal}
              focal_diags={this.focal_diags}
              mode={this.state.mode}
            />
          </div>

          <div className="col-xs-4">
            <LyricsPane verse={this.state.verse} 
              hover_cb={(i) => this.setState({lyrics_focal: i})}
              highlights={this.lyrics_highlights}
              onChange={this.onTextChange}
            />

            {this.state.verse.isCustom() &&
              <button onClick={this.makePermalink}>Export</button>
            }
          </div>
        </div>

        <div className="row">
          <label>
            Mode
            <form>
              {radios}
            </form>
          </label>
        </div>

        </div>
        );
  }
}

export default Songsim;

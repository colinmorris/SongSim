import React, { Component } from 'react';
import { ResizableBox } from 'react-resizable';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import './Songsim.css';

import Toolbox from './Toolbox';
import Matrix from './Matrix.js';
import { Diagonal } from './utils.js';
import DummyMatrix from './DummyMatrix.js';
import LyricsPane from './LyricsPane.js';
import SongSelector from './SongSelector.js';
import {CustomVerse, CannedVerse} from './verse.js';
import {CUSTOM_SLUG, NOINDEX} from './constants.js';
import { LANDING_CANNED } from './canned.js';
import LANDING_LYRICS from './landing_lyrics.js';
import config from './config.js';
import DBHelper from './firebasehelper.js';
import CANNED_SONGS from './canned-data.js';

class Songsim extends Component {
  constructor(props) {
    super(props);
    this.db = new DBHelper();
    var verse = this.getVerse();
    this.state = {verse: verse,
      matrix_focal: {x: NOINDEX, y: NOINDEX},
      lyrics_focal: NOINDEX,
      mode: config.default_mode,
      ignore_singletons: false,
      ignore_stopwords: config.stopwords,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname === nextProps.location.pathname) {
      console.log('Ignoring props update');
      return;
    }
    // new songid
    // update verse
    var verse = this.getVerse(nextProps);
    // and clear any old highlighting
    this.setState({verse: verse, matrix_focal: {x: NOINDEX, y:NOINDEX},
      lyrics_focal: NOINDEX});

  }

  
  // TODO: make this return a promise or something
  /** Fetches an initial verse corresponding to the given props (i.e. the URL).
   * If possible, return the appropriate verse immediately. Otherwise, return
   * a dummy value and asynchronously request the corresponding data, and then
   * set the verse state when it's ready.
   */
  getVerse(props) {
    props = props || this.props;
    // Four possibilities wrt URL:
    // - /custom/[key] : firebase key
    // - /custom       : blank custom verse
    // - /             : default landing song (return it immediately)
    // - /[slug]       : canned song slug
    if (props.params.customKey) {
      // it's a firebase key
      var key = props.params.customKey;
      console.log(`Looking up firebase key ${key}`);
      this.db.load(key).then( (snapshot) => {
        // TODO: gracefully fail here?
        var txt = snapshot.val();
        var verse = new CustomVerse(txt, key);
        this.onTextChange(verse);
      });
    } else if (props.location.pathname === "/custom") {
      return CustomVerse.BlankVerse();
    } else if (props.params.songId) {
      let songId = props.params.songId;
      var canned = SongSelector.lookupCanned(songId);
      if (canned) {
        SongSelector.loadSong(this.onTextChange, canned);
      } else {
        console.error(`Uh oh. Failed to load slug ${songId}`);
      }
    } else {
      // Return the default landing song.
      var c = LANDING_CANNED;
      return CannedVerse.fromCanned(c, LANDING_LYRICS);
    }
    // If we've reached this far, we must be loading asynchronously. Return nothing.
    return undefined;
  }

  onTextChange = (verse) => {
    this.setState({verse: verse});
  }

  // TODO: sort of confusingly named at this point
  makePermalink = () => {
    console.log('Permalinking');
    console.assert(this.state.verse.isCustom() && !this.state.verse.key);
    var ref = this.db.push(this.state.verse);
    console.log(ref);
    console.log(`Url = ${ref.toString()}`);
    console.log(`key = ${ref.key}`);
    this.setState(prevState => ({
      verse: new CustomVerse(prevState.verse.raw, ref.key)
    }));
    // should this also change the URL? Probably easier to say that
    // if you have a firebase key in the URL (i.e. you presumably had this
    // link shared from someone), the text should be immutable, and if 
    // url=custom, it's mutable. 
  }

  /** Only used to generate SVGs for gallery. Super hacky. **/
  batchExportSVGs = () => {
    let zip = new JSZip();
    let i = 0;
    let dur = 3000;
    var max = 333;
    for (let canned of CANNED_SONGS) {
      window.setTimeout(() => {
      SongSelector.loadSong( (verse) => {
        this.setState({verse: verse});
      }, canned);
      }, i*dur);
      window.setTimeout(() => {
        var svg = this.matrix.getSVG();
        zip.file(canned.slug + '.svg', svg);
      }, i*dur+ (dur/2));
      i++;
      if (i >= max) {
        break;
      }
    }
    window.setTimeout(() => {
      zip.generateAsync({type:'blob'}).then( (c) => {
        saveAs(c, 'matrices.zip');
      });
    }, dur * Math.min(max, CANNED_SONGS.length));
    //var blob = new Blob(['hello world'], {type: 'text/plain'});
    //saveAs(blob, 'hello.txt');
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

    if (config.checkerboard) {
      var indices = new Set();
      for (let diag of foc.keys()) {
        indices.add(diag.x0);
        indices.add(diag.y0);
      }
      for (let x0 of indices) {
        for (let y0 of indices) {
          add(Diagonal.fromPointAndLength(x0, y0, primary.length),
              'incidental');
        }
      }
    }
    return foc;
  }

  get lyrics_highlights() {
    var hl = new Map();
    var lindex = this.state.lyrics_focal;
    if (lindex !== NOINDEX) {
      hl.set(lindex, 'focal');
      for (let j of this.state.verse.matrix.matches_for_index(lindex)) {
        hl.set(j, 'incidental');
      }
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

  render() {
    // TODO: this method is getting pretty huge
    var rowcols = this.focal_rowcols;
    var rows = rowcols[0], cols = rowcols[1];
    var matrix;
    if (!this.state.verse) {
      matrix = <DummyMatrix />;
    } else {
      // TODO: probably passing way more props than necessary at this point
      matrix = (
        <Matrix 
          verse={this.state.verse} 
          hover_cb={this.matrix_hover_cb}
          focal_rows={rows}
          focal_cols={cols}
          matrix_focal={this.state.matrix_focal}
          lyrics_focal={this.state.lyrics_focal}
          focal_diags={this.focal_diags}
          mode={this.state.mode}
          ignore_singletons={this.state.ignore_singletons}
          stopwords={this.state.ignore_stopwords}
          ref={(m) => {this.matrix = m}}
        />
      );
    }
    var debug;
    // TODO: debug component?
    if (config.debug && this.state.verse) {
      var rects = Array.from(this.state.verse.rects());
      debug = (<div>
          <p>
          {this.state.verse.matrix.length} x {this.state.verse.matrix.length}{", "} 
          {rects.length} rects
          </p>
          <p>Custom: {JSON.stringify(this.state.verse.isCustom())}</p>
          <button onClick={this.batchExportSVGs}>Do stuff</button>
          <a href={this.props.router.createHref('custom/' + config.testingFBKey)}>
            Custom song.
          </a>
        </div>);
    }
    var defaultMatrixSize = 500; // TODO: have this flow from above (and calculate from screen.height or something)
    return (
      <div>

        <div className="container-fluid mainContainer">
          <ResizableBox width={defaultMatrixSize} height={defaultMatrixSize}
            lockAspectRatio={true}
            >
              {matrix}
          </ResizableBox>

          <div className="lyricsPane">
              <LyricsPane verse={this.state.verse || CustomVerse.BlankVerse()} 
                loading={!this.state.verse}
                hover_cb={(i) => this.setState({lyrics_focal: i})}
                highlights={this.lyrics_highlights}
                onChange={this.onTextChange}
                slug={this.state.verse && this.state.verse.id}
              />

          </div>
        </div> {/* /mainContainer */}
        <div className="container">
        <Toolbox
          verse={this.state.verse}
          mode={this.state.mode}
          ignoreSingletons={this.state.ignore_singletons}
          ignore_stopwords={this.state.ignore_stopwords}
          onStateChange={(state) => {this.setState(state)}}
          exportSVG={this.matrix && this.matrix.exportSVG}
          onShare={this.makePermalink}
          router={this.props.router}
        />
        </div>
        {/* ^ This onStateChange thing sort of defies separation of concerns, 
            but it also means writing less boilerplate code, sooooo */}
        {debug}
        </div>
        );
  }
}

export default Songsim;

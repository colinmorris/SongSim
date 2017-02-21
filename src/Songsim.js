import React, { Component } from 'react';

import './Songsim.css';

import Matrix from './Matrix.js';
import LyricsPane from './LyricsPane.js';
import SongSelector from './SongSelector.js';
import {Verse} from './verse.js';
import {NOINDEX} from './constants.js';
import LANDING_LYRICS from './landing_lyrics.js';
import config from './config.js';

class Songsim extends Component {
  constructor(props) {
    super(props);
    var text = LANDING_LYRICS;
    this.state = {verse: new Verse(text),
      matrix_focal: {x: NOINDEX, y: NOINDEX},
      lyrics_focal: NOINDEX,
      color: config.color_words, 
    };
  }

  onTextChange = (t) => {
    this.setState({verse: new Verse(t)});
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

  render() {
    var rowcols = this.focal_rowcols;
    var rows = rowcols[0], cols = rowcols[1];
    return (
        <div>

        <SongSelector onSelect={this.onTextChange} />

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
              color_words={this.state.color}
            />
          </div>

          <div className="lyricspane col-xs-4">
            <LyricsPane verse={this.state.verse} 
              hover_cb={(i) => this.setState({lyrics_focal: i})}
              highlights={this.lyrics_highlights}
            />
          </div>
        </div>

        <div className="row">
          <label>
            Colorify
            <input type="checkbox" checked={this.state.color}
              onChange={(e) => this.setState({color: e.target.checked})} />
          </label>
        </div>

        </div>
        );
  }
}

export default Songsim;

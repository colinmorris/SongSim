import React, { Component } from 'react';

import './Songsim.css';

import Matrix from './Matrix.js';
import LyricsPane from './LyricsPane.js';
import SongSelector from './SongSelector.js';
import {VerseMatrix, Verse} from './verse.js';
import {NOINDEX} from './constants.js';
import {Diagonal} from './utils.js';
import config from './config.js';

class Songsim extends Component {
  constructor(props) {
    super(props);
    var text = "I never wanna hear you say\nThat I want it that way";
    this.state = {verse: new Verse(text),
      matrix_focal: {x: NOINDEX, y: NOINDEX},
      lyrics_focal: NOINDEX,
    };
    // TODO: this is silly. Should just bundle the default txt file.
    SongSelector.loadSong(this.onTextChange);
  }

  onTextChange = (t) => {
    this.setState({verse: new Verse(t)});
  }

  get focal_rect() {
    console.assert(this.state.lyrics_focal === NOINDEX 
        || this.state.matrix_focal.x === NOINDEX, "Shouldn't both be set");
    if (this.state.lyrics_focal !== NOINDEX) {
      return {x: this.state.lyrics_focal, y: this.state.lyrics_focal};
    }
    return this.state.matrix_focal;
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

  /** Return a map of diagonals to 'strength' (ints)
   */
  get focal_diags() {
    var foc = new Map();
    if (this.state.matrix_focal.x === NOINDEX) {
      return foc;
    }
    var primary = this.focal_local_diag;
    // TODO: prolly just use string (classname) values instead of ints
    foc.set(primary, 'primary');
    for (let correl of primary.mainCorrelates()) {
      foc.set(correl, 'primary-diag');
    }
    for (let correl of this.state.verse.matrix.incidental_correlates(primary)) {
      foc.set(correl, 'incidental');
    }
    return foc;
  }

  get lyrics_highlights() {
    var hl = new Map();
    if (this.state.lyrics_focal !== NOINDEX) {
      hl.set(this.state.lyrics_focal, 'focal');
      // TODO: row/col matches?
    } else if (this.state.matrix_focal.x !== NOINDEX) {
      // Focal rect
      hl.set(this.state.matrix_focal.x, 'focal');
      hl.set(this.state.matrix_focal.y, 'focal');
      // This is lazy, but should basically work for now
      for (let [diag, strength] of this.focal_diags) {
        for (let [x, y] of diag.points()) {
          if (!hl.has(x)) {
            hl.set(x, strength);
          }
        }
      }
    }
    return hl;
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
            hover_cb={(pt) => this.setState({matrix_focal: pt})}
            focal_rect={this.focal_rect}
            focal_rows={rows}
            focal_cols={cols}
            focal_diags={this.focal_diags}
          />
        </div>

        <div className="lyricspane col-xs-4">
          <LyricsPane verse={this.state.verse} 
            hover_cb={(i) => this.setState({lyrics_focal: i})}
            highlights={this.lyrics_highlights}
          />
        </div>

        </div>
        </div>
        );
  }
}

export default Songsim;

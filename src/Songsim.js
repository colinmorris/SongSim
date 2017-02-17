import React, { Component } from 'react';

import Matrix from './Matrix.js';
import LyricsPane from './LyricsPane.js';
import SongSelector from './SongSelector.js';
import {VerseMatrix, Verse} from './verse.js';
import {NOINDEX} from './constants.js';
import {Diagonal} from './utils.js';

class Songsim extends Component {
  constructor(props) {
    super(props);
    var text = "I never wanna hear you say\nThat I want it that way";
    this.state = {verse: new Verse(text),
      matrix_focal: {x: NOINDEX, y: NOINDEX},
      lyrics_focal: NOINDEX,
    };
  }

  onTextChange = (t) => {
    this.setState({verse: new Verse(t)});
  }

  get focal_rect() {
    console.assert(this.lyrics_focal === NOINDEX 
        || this.matrix_focal.x === NOINDEX, "Shouldn't both be set");
    if (this.lyrics_focal !== NOINDEX) {
      return {x: this.lyrics_focal, y: this.lyrics_focal};
    }
    return this.matrix_focal;
  }

  get focal_rowcols() {
    if (this.lyrics_focal !== NOINDEX) {
      var thing = [this.lyrics_focal, this.lyrics_focal];
      return [thing, thing];
    }
    if (this.matrix_focal.x !== NOINDEX) {
      var diag = this.focal_local_diag;
      return [diag.yrange, diag.xrange];
    }
    return [undefined, undefined];
  }

  get focal_local_diag() {
    if (this.matrix_focal.x === NOINDEX) {
      return undefined;
    }
    var matrix = this.state.verse.matrix;
    return matrix.local_diagonal(this.matrix_focal.x, this.matrix_focal.y);
  }

  render() {
    return (
        <div>
        <SongSelector onSelect={this.onTextChange} />
        <div className="row">

        <div className="col-xs-9">
          <Matrix 
            matrix={this.state.verse.matrix} 
            verse={this.state.verse} 
            hover_cb={(coords) => this.setState({matrix_hover: coords})}
            focal_rect={this.focal_rect}
            focal_rows={this.focal_rows}
            focal_cols={this.focal_cols}
            focal_diags={this.focal_diags}
          />
        </div>

        <div className="col-xs-3">
          <LyricsPane verse={this.state.verse} 
            hovers={this.state.matrix_hover}
          />
        </div>

        </div>
        </div>
        );
  }
}

export default Songsim;

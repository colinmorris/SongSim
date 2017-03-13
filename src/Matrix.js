import React, { Component } from 'react';
import { hsluvToHex } from 'hsluv';
import { saveAs } from 'file-saver';

import './Matrix.css';

import {STOPWORDS, NOINDEX, MODE} from './constants.js';
import config from './config.js';

// TODO: colormap docs (https://www.npmjs.com/package/colormap) say that n>10
// should be enough divisions for any colormap, but using the 'warm' colormap
// with n=12 led to 4 repeated colors. Should file a bug.
//var MIN_COLORS = 128;

/** For reasons of performance, we separate the highlighting effects we do on
 * hover into a separate component from the basic structure of the matrix. The
 * former will change frequently, and the latter rarely (only when the user 
 * selects a different text, or changes the rendering mode). 
 *
 * The base matrix can have a *lot* of rects (Bad Romance has over 10k, for
 * example). We don't want to be re-generating them over and over whenever
 * the mouse moves.
 */
class BaseMatrix extends Component {

  /** These handlers are a little tricky. We use a wide zero-opacity stroke
   * around rects to make them easier to hover on (they can be really small,
   * for long songs/small screens). But a nasty side effect of this is that 
   * we can get spurious mouse entry from one rect to an adjacent one. 
   */
  handleRectEnter = (e) => {
    var rect = e.target;
    var x = rect.x.baseVal.value, y = rect.y.baseVal.value;
    this.props.hover_cb({x, y});
  }
  handleRectLeave = (e) => {
    // TODO: Do some math comparing the centre of the currently hovered
    // rect, with the related target. If the currently hovered rect is closer
    // to (e.clientX, e.clientY), then ignore this event (and the associated
    // rectEnter event). 
    //console.log(e.currentTarget.getBoundingClientRect());
    //console.log(e.relatedTarget.getBoundingClientRect());
    this.props.hover_cb({x:NOINDEX, y:NOINDEX});
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(this.props.verse === nextProps.verse
        && this.props.mode === nextProps.mode
        && this.props.ignore_singletons === nextProps.ignore_singletons
        && this.props.stopwords === nextProps.stopwords
        );
  }

  static colorify(i, n_indices) {
    var hue = Math.min(360, Math.floor(360 * i/n_indices));
    return hsluvToHex([hue, config.rect_saturation, config.rect_lightness]);
  }

  rectColor(x) {
    if (this.props.mode === MODE.vanilla) {
      return 'black';
    } else if (this.props.mode === MODE.colorful) {
      var i = this.props.verse.uniqueWordId(x);
      if (i === -1) { // hapax
        return 'black';
      }
      return BaseMatrix.colorify(i, this.props.verse.nWords);
    } else if (this.props.mode === MODE.color_title) {
      // TODO: maybe should only color intact instances of the title? kind of 
      // annoying to draw a bunch of useless colored dots because the title
      // has the word "the". Trickier to implement though.
      var word = this.props.verse.clean_words[x];
      var title_tokens = this.props.verse.title_tokens;
      var idx = title_tokens.indexOf(word);
      if (idx === -1) {
        return 'black';
      }
      return 'fuchsia';
      //return BaseMatrix.colorify(idx, title_tokens.length);
    } else {
      console.error("Not implemented");
    }
  }

  renderRect(r) {
    if (this.props.ignore_singletons && this.props.verse.matrix.is_singleton(r.x, r.y)) {
      return;
    }
    // TODO: should probably go further up the chain
    if (this.props.stopwords && STOPWORDS.has(this.props.verse.clean_words[r.x])
        && this.props.verse.matrix.is_singleton(r.x, r.y)
        ) {
      return;
    }
    var key = r.x + (this.props.verse.matrix.length * r.y);
    return (<rect key={key}
              className="wordrect"
              x={r.x} y={r.y} width={r.width} height={r.height}
              onMouseEnter={this.handleRectEnter}
              onMouseLeave={this.handleRectLeave}
              fill={this.rectColor(r.x)}
            />);
  }

  render() {
    var rects = Array.from(this.props.verse.rects()).map(
        this.renderRect.bind(this));
    return <g>{rects}</g>;
  }
}

/** This component is just responsible for the responsive highlighting stuff
 * we do when hovering over the matrix. **/
class MatrixHighlights extends Component {
  row_rect() {
    if (!this.props.focal_rows) return;
    var className = (this.props.lyrics_focal !== NOINDEX) ? "alley lyrics-alley" : "alley";
    return (<rect className={className} x="0" y={this.props.focal_rows[0]}
        width={this.props.matrix_length} height={1+ this.props.focal_rows[1] - this.props.focal_rows[0]}
        />);
  }
  col_rect() {
    if (!this.props.focal_cols) return;
    var className = (this.props.lyrics_focal !== NOINDEX) ? "alley lyrics-alley" : "alley";
    return (<rect className={className} x={this.props.focal_cols[0]} y="0"
        height={this.props.matrix_length} width={1+ this.props.focal_cols[1] - this.props.focal_cols[0]}
        />);
  }

  rectFromDiagonal(diag_label_pair) {
    var diag = diag_label_pair[0];
    var className = diag_label_pair[1];
    return (<rect 
        key={diag.x0 + "_" + diag.y0}
        className={"focalBlock " + className} 
        x={diag.x0} y={diag.y0}
        width={diag.length} height={diag.length}
        />);
  }

  render() {
    console.assert(this.props.lyrics_focal === NOINDEX || 
        this.props.matrix_focal.x === NOINDEX, "In two places at once?");
    var filling = '';
    if (this.props.matrix_focal.x !== NOINDEX) {
      filling = Array.from(this.props.focal_diags).map(this.rectFromDiagonal);
    } 
    return (<g className="matrixHighlights">
        {filling} {this.row_rect()} {this.col_rect()}
        </g>);
  }
}

/** WIP: Another way of doing highlighting, drawing 'shadow' rects on top of
 * the BaseMatrix rects, having some distinctive color.
 * Could be a replacement for the current MatrixHighlights method of highlighting
 * hovered diagonals, or maybe just use in cases where the highlighted diagonal is
 * of length 1 (or less than, say, 5), where the MatrixHighlights approach fails.
 */
class ShadowMatrix extends Component {

  renderRect(r) {
    if (this.props.ignore_singletons && this.props.verse.matrix.is_singleton(r.x, r.y)) {
      return;
    }
    var key = r.x + (this.props.verse.matrix.length * r.y);
    return (<rect key={key}
              className="shadowwordrect"
              x={r.x} y={r.y} width={r.width} height={r.height}
              fill='#00e1f7'
            />);
  }

  render() {
    var rects = [];
    for (let [diag, _label] of this.props.focal_diags) {
      for (let [x, y] of diag.points()) {
        rects.push( this.renderRect( {x: x, y: y, width: 1, height: 1} ) );
      }
    }
    return <g>{rects}</g>
  }
}

class Matrix extends Component {

  exportSVG = () => {
    console.log("Exporting svg");
    var svg = this.getSVG();
    var blob = new Blob([svg], {type: 'image/svg+xml'});
    var fname = this.props.verse.id + '.svg';
    saveAs(blob, fname);
  }

  getSVG = () => {
    this.svg.setAttribute('version', '1.1');
    this.svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
    return this.svg.outerHTML;
  }


  render() {
    var n = Math.max(1, this.props.verse.matrix.length);
    var viewBox = `0 0 ${n} ${n}`;
    // TODO: Highlights, then base, then shadow rects
    var res = (
        <div className="matrixWrapper">
        <svg className="matrix" viewBox={viewBox} 
          ref={(r) => {this.svg = r;}}
        >
        <g>
          <MatrixHighlights 
            focal_rows={this.props.focal_rows} 
            focal_cols={this.props.focal_cols} 
            matrix_length={this.props.verse.matrix.length} 
            matrix_focal={this.props.matrix_focal}
            lyrics_focal={this.props.lyrics_focal}
            focal_diags={this.props.focal_diags}
          />
          <BaseMatrix 
            verse={this.props.verse}
            hover_cb={this.props.hover_cb}
            mode={this.props.mode}
            ignore_singletons={this.props.ignore_singletons}
            stopwords={this.props.stopwords}
          />
        </g>
        </svg>
        </div>
    );
    return res;
  }
}

Matrix.propTypes = {
  // foo: React.PropTypes.string
};

export default Matrix;

import React, { Component } from 'react';
import colormap from 'colormap';

import './Matrix.css';

import {NOINDEX, MODE} from './constants.js';
import config from './config.js';

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

  _cm() {
    if (this.props.mode === MODE.color_title) {
      return colormap({colormap: "warm", nshades: 11});
    } else {
      return colormap({colormap: config.colormap, 
        nshades: Math.max(11, this.props.verse.nWords)});
    }
  }
  
  handleRectEnter = (e) => {
    var rect = e.target;
    var x = rect.x.baseVal.value, y = rect.y.baseVal.value;
    this.props.hover_cb({x, y});
  }
  handleRectLeave = (e) => {
    this.props.hover_cb({x:NOINDEX, y:NOINDEX});
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(this.props.verse === nextProps.verse
        && this.props.matrix === nextProps.matrix
        && this.props.mode === nextProps.mode);
  }

  rectColor(x) {
    if (this.props.mode === MODE.vanilla) {
      return 'black';
    } else if (this.props.mode === MODE.colorful) {
      var i = this.props.verse.uniqueWordId(x);
      if (i === -1) { // hapax
        return 'black';
      }
      return this.cm[i];
    } else if (this.props.mode === MODE.color_title) {
      // TODO: maybe should only color intact instances of the title? kind of 
      // annoying to draw a bunch of useless colored dots because the title
      // has the word "the". Trickier to implement though.
      var word = this.props.verse.clean_words[x];
      var title_tokens = this.props.verse.title_tokens;
      var idx = title_tokens.indexOf(word);
      //idx *= Math.floor(11 / title_tokens.length);
      if (idx === -1) {
        return 'black';
      } else {
        return this.cm[idx+1];    
      }
    } else {
      console.error("Not implemented");
    }
  }

  renderRect(r) {
    var key = r.x + (this.props.matrix.length * r.y);
    return (<rect key={key}
              className="wordrect"
              x={r.x} y={r.y} width={r.width} height={r.height}
              onMouseEnter={this.handleRectEnter}
              onMouseLeave={this.handleRectLeave}
              fill={this.rectColor(r.x)}
            />);
  }

  render() {
    this.cm = this._cm();
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

class Matrix extends Component {
  constructor(props) {
    super(props);
    this.H = 800;
    this.W = 800;
  }

  render() {
    var scale = this.H / this.props.matrix.length;
    var scalestr = `scale(${scale})`;
    var debug;
    if (config.debug) {
      var rects = Array.from(this.props.verse.rects());
      debug = (<p>
          {this.props.matrix.length} x {this.props.matrix.length}{", "} 
          {rects.length} rects
        </p>);
    }
    var res = (
        <svg className="matrix" height={this.H} width={this.W} >
        <g transform={scalestr}>
          <MatrixHighlights 
            focal_rows={this.props.focal_rows} 
            focal_cols={this.props.focal_cols} 
            matrix_length={this.props.matrix.length} 
            matrix_focal={this.props.matrix_focal}
            lyrics_focal={this.props.lyrics_focal}
            focal_diags={this.props.focal_diags}
          />
          <BaseMatrix 
            verse={this.props.verse}
            matrix={this.props.matrix}
            hover_cb={this.props.hover_cb}
            mode={this.props.mode}
          />
        </g>
        </svg>
    );
    if (config.debug) {
      return <div>{res} {debug}</div>;
    }
    return res;
  }
}

Matrix.propTypes = {
  // foo: React.PropTypes.string
};

export default Matrix;

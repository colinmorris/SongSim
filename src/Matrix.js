import React, { Component } from 'react';
import colormap from 'colormap';

import './Matrix.css';

import {NOINDEX} from './constants.js';
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
    return colormap({colormap: config.colormap, 
      nshades: Math.max(11, this.props.verse.nWords)});
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
        && this.props.color_words === nextProps.color_words);
  }

  rectColor(x) {
    if (!this.props.color_words) {
      return 'black';
    } else {
      var i = this.props.verse.uniqueWordId(x);
      if (i == -1) { // hapax
        return 'black';
      }
      return this.cm[i];
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

class MatrixHighlights extends Component {

  row_rect() {
    if (!this.props.focal_rows) return;
    return (<rect className="alley" x="0" y={this.props.focal_rows[0]}
        width={this.props.matrix_length} height={1+ this.props.focal_rows[1] - this.props.focal_rows[0]}
        />);
  }
  col_rect() {
    if (!this.props.focal_cols) return;
    return (<rect className="alley" x={this.props.focal_cols[0]} y="0"
        height={this.props.matrix_length} width={1+ this.props.focal_cols[1] - this.props.focal_cols[0]}
        />);
  }

  render() {
    return (<g>{this.row_rect()} {this.col_rect()}</g>);
  }
}

class Matrix extends Component {
  constructor(props) {
    super(props);
    // TODO: static vars
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
          <BaseMatrix 
            verse={this.props.verse}
            matrix={this.props.matrix}
            hover_cb={this.props.hover_cb}
            color_words={this.props.color_words}
          />
          <MatrixHighlights 
            focal_rows={this.props.focal_rows} 
            focal_cols={this.props.focal_cols} 
            matrix_length={this.props.matrix.length} />
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

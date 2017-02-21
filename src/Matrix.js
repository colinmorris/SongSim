import React, { Component } from 'react';
import colormap from 'colormap';

import './Matrix.css';

import {NOINDEX} from './constants.js';
import config from './config.js';

class Matrix extends Component {
  constructor(props) {
    super(props);
    this.H = 800;
    this.W = 800;
  }

  _cm() {
    return colormap({colormap: config.colormap, 
      nshades: Math.max(11, this.props.verse.nWords)});
  }

  handleClick = (e) => {
    console.log(`Clicky click of type ${e.type}`);
  }

  handleRectEnter = (e) => {
    var rect = e.target;
    var x = rect.x.baseVal.value, y = rect.y.baseVal.value;
    this.props.hover_cb({x, y});
  }

  handleRectLeave = (e) => {
    this.props.hover_cb({x:NOINDEX, y:NOINDEX});
  }

  rectClassName(x, y) {
    if (x === this.props.focal_rect.x && y == this.props.focal_rect.y) {
      return 'wordrect focal undermouse';
    }
    for (let [diag, strength] of this.props.focal_diags) {
      if (diag.contains(x, y)) {
        // TODO: use strength
        return 'wordrect focal ' + strength;
      }
    }
    return 'wordrect';
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
              className={this.rectClassName(r.x, r.y)}
              x={r.x} y={r.y} width={r.width} height={r.height}
              onMouseEnter={this.handleRectEnter}
              onMouseLeave={this.handleRectLeave}
              fill={this.rectColor(r.x)}
            />);
  }

  row_rect() {
    if (!this.props.focal_rows) return;
    return (<rect className="alley" x="0" y={this.props.focal_rows[0]}
        width={this.props.matrix.length} height={1+ this.props.focal_rows[1] - this.props.focal_rows[0]}
        />);
  }
  col_rect() {
    if (!this.props.focal_cols) return;
    return (<rect className="alley" x={this.props.focal_cols[0]} y="0"
        height={this.props.matrix.length} width={1+ this.props.focal_cols[1] - this.props.focal_cols[0]}
        />);
  }

  render() {
    this.cm = this._cm();
    var rects = Array.from(this.props.verse.rects()).map(
        this.renderRect.bind(this));
    var scale = this.H / this.props.matrix.length;
    var scalestr = `scale(${scale})`;
    var debug;
    if (config.debug) {
      debug = (<p>
          {this.props.matrix.length} x {this.props.matrix.length}{", "} 
          {rects.length} rects
        </p>);
    }
    var res = (
        <svg className="matrix" height={this.H} width={this.W} >
        <g transform={scalestr}>
          {rects}
          {this.row_rect()}
          {this.col_rect()}
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

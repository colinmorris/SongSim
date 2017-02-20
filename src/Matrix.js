import React, { Component } from 'react';

import './Matrix.css';

import {NOINDEX} from './constants.js';

class Matrix extends Component {
  constructor(props) {
    super(props);
    this.H = 800;
    this.W = 800;
  }

  handleClick = (e) => {
    console.log(`Clicky click of type ${e.type}`);
  }

  handleRectEnter = (e) => {
    console.log('entered');
    var rect = e.target;
    var x = rect.x.baseVal.value, y = rect.y.baseVal.value;
    this.props.hover_cb({x, y});
  }

  handleRectLeave = (e) => {
    console.log('left');
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

  RectFromCoords(coords) {
    var x = coords.x, y = coords.y;
    var key = (x * this.props.matrix.length) + y;
    var sidelength = 1.00;
    return (<rect key={key} 
              className={this.rectClassName(x, y)}
              x={x} y={y} width={sidelength} height={sidelength}
              onMouseEnter={this.handleRectEnter}
              onMouseLeave={this.handleRectLeave}
            />
           );
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
    var rects = this.props.matrix.adjacency_list.map(
        this.RectFromCoords.bind(this)
    );
    var scale = this.H / this.props.matrix.length;
    var scalestr = `scale(${scale})`;
    return (
        <svg className="matrix" height={this.H} width={this.W} >
        <g transform={scalestr}>
          {rects}
          {this.row_rect()}
          {this.col_rect()}
        </g>
        </svg>
    );
  }
}

Matrix.propTypes = {
  // foo: React.PropTypes.string
};

export default Matrix;

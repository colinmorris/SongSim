import React, { Component } from 'react';
import './Matrix.css';

class Matrix extends Component {
  constructor(props) {
    super(props);
    this.H = 800;
    this.W = 800;
    this.state = {focused_diagonal: undefined};
  }

  handleClick = (e) => {
    console.log(`Clicky click of type ${e.type}`);
  }

  handleRectEnter = (e) => {
    var rect = e.target;
    var x = rect.x.baseVal.value, y = rect.y.baseVal.value;
    // Extend selection along diagonal
    var diag = this.getLocalDiagonal(x, y);
    this.setState({focused_diagonal: diag});
    // Highlight local chunk + corresponding chunks on main diag ( + corresp chunks off main diag?)
    // transmit up the chain
    this.props.hover_cb([x, y]);
  }

  handleRectLeave = (e) => {
    this.props.hover_cb([]);
    // Clear any highlighting
    this.setState({focused_diagonal: undefined});
  }

  shouldHighlight(x, y) {
    // TODO: fancier
    var d = this.state.focused_diagonal;
    if (!d) return false;
    return (d.x0 <= x && x <= d.x1 && ((x - y) === (d.x0 - d.y0)));
  }

  RectFromCoords(coords) {
    var x = coords.x, y = coords.y;
    var key = (x * this.props.matrix.length) + y;
    // I don't quite get why the 1s need to be quoted?
    return (<rect key={key} 
              className={this.shouldHighlight(x, y) ? "focused" : ""}
              x={x} y={y} width="1" height="1"
              onMouseEnter={this.handleRectEnter}
              onMouseLeave={this.handleRectLeave}
            />
           );
  }

  render() {
    /** Given text, compute self-similarity matrix
     *  naive drawing impl: for each x,y draw rect
     */
    var rects = this.props.matrix.adjacency_list.map(
        this.RectFromCoords.bind(this)
    );
    var scale = this.H / this.props.matrix.length;
    var scalestr = `scale(${scale})`;
    return (
        <svg height={this.H} width={this.W} >
        <g transform={scalestr}>
          {rects}
        </g>
        </svg>
    );
  }
}

Matrix.propTypes = {
  // foo: React.PropTypes.string
};

export default Matrix;

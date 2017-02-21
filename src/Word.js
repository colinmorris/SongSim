import React, { Component } from 'react';

import {NOINDEX} from './constants.js';

import './Word.css';


class Word extends Component {
  constructor(props) {
    super(props);
  }

  onEnter = (e) => {
    this.props.hover_cb(this.props.i);
  }
  onLeave = (e) => {
    this.props.hover_cb(NOINDEX);
  }

  render() {
    var kls = this.props.focus;
    return (<span className={kls} onMouseEnter={this.onEnter}
             onMouseLeave={this.onLeave}>
              {this.props.raw}{" "}
            </span>);
  }

}

export default Word;

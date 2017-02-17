import React, { Component } from 'react';

import './Word.css';


class Word extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var kls = this.props.focus ? "focus" : "";
    return (<span className={kls}>{this.props.raw}</span>);
  }

}

export default Word;

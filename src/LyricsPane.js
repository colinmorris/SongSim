import React, { Component } from 'react';

import './LyricsPane.css';

import Word from './Word.js';

class LyricsPane extends Component {
  constructor(props) {
    super(props);
  }

  handleHover = (e) => {

  }

  renderWord = (word) => {
    return (<Word i={word.i} key={word.i} raw={word.raw} 
                focus={this.props.highlights.get(word.i) || 0} 
                hover_cb={this.props.hover_cb}
            />);
  }

  renderLine = (line, idx) => {
    var words = line.map(this.renderWord);
    return <div key={idx}>{words}</div>;
  }

  render() {
    var lines = this.props.verse.lines.map(this.renderLine);
    return (
        <div className="line">
          {lines}
        </div>
    );
  }
}

export default LyricsPane;

import React, { Component } from 'react';
import Word from './Word.js';

class LyricsPane extends Component {
  constructor(props) {
    super(props);
  }

  handleHover = (e) => {

  }

  renderWord = (word) => {
    return (<Word i={word.i} key={word.i} raw={word.raw} 
                focus={this.props.hovers.includes(word.i)} 
            />);
  }

  renderLine = (line, idx) => {
    var words = line.map(this.renderWord);
    return <p key={idx}>{words}</p>;
  }

  render() {
    var lines = this.props.verse.lines.map(this.renderLine);
    return (
        <div>
          {lines}
        </div>
    );
  }
}

export default LyricsPane;

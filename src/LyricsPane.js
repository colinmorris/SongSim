import React, { Component } from 'react';

import './LyricsPane.css';

import {NOINDEX} from './constants.js';
import Word from './Word.js';

class LyricsPane extends Component {

  constructor(props) {
    super(props);
    this.state = {editing: false};
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

  onTextEdit = (e) => {
    this.setState({editing: false});
    this.props.onChange(e.target.value);
  }

  componentDidUpdate() {
    if (this.ta) {
      this.ta.focus();
    }
  }

  startEditing = () => {
    this.clearHover();
    this.setState({editing: true});
  }

  clearHover() {
    this.props.hover_cb(NOINDEX);
  }

  render() {
    var filling;
    if (this.state.editing) {
      filling = (<textarea 
          defaultValue={this.props.verse.raw} 
          onBlur={this.onTextEdit}
          ref={(ta) => {this.ta = ta}}
      />);
    } else {
      var lines = this.props.verse.lines.map(this.renderLine);
      filling = (
          <div>
            <div className="words" onClick={this.startEditing} >
              {lines}
            </div>
            <button onClick={this.startEditing}>Edit</button>
          </div>
      );
    }
    return <div className="lyricsPane">{filling}</div>;
  }
}

export default LyricsPane;

import React, { Component } from 'react';

import './LyricsPane.css';

import {NOINDEX} from './constants.js';
import Word from './Word.js';
import {CustomVerse} from './verse.js';

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
    // TODO: be a bit more careful here...
    // - if the new text value is blank, revert to the old text
    // - if the text is unchanged, don't do anything (we don't
    //    want to overwrite a CannedVerse with a CustomVerse having
    //    the same content).
    var verse = new CustomVerse(e.target.value, "customsong");
    this.props.onChange(verse);
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

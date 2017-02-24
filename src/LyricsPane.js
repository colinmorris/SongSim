import React, { Component } from 'react';

import './LyricsPane.css';

import {NOINDEX} from './constants.js';
import Word from './Word.js';
import SongSelector from './SongSelector.js';
import {CustomVerse} from './verse.js';

class LyricsPane extends Component {

  constructor(props) {
    super(props);
    this.state = {editingExtant: false};
  }

  get editing() {
    return this.state.editingExtant || 
      (!this.props.loading && this.props.verse.isBlank());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading || (nextProps.verse !== this.props.verse)) {
      this.setState({editingExtant: false});
    }
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

  onTextEdit = () => {
    if (this.props.verse.isFrozen()) {
      console.error("Tried to edit a song that shouldn't be editable. Bailing.");
      return;
    }
    // TODO: unnecessary?
    //this.setState({editing: false});
    // TODO: be a bit more careful here...
    // - if the new text value is blank, revert to the old text
    // - if the text is unchanged, don't do anything (we don't
    //    want to overwrite a CannedVerse with a CustomVerse having
    //    the same content).
    console.log(this.ta.value);
    var verse = new CustomVerse(this.ta.value);
    console.log("Got text edit event");
    this.props.onChange(verse);
  }

  abortEditing = () => {
    console.log("Aborted editing");
    this.setState({editingExtant: false});
  }

  componentDidMount() {
    if (this.ta) {
      this.ta.focus();
    }
  }

  componentDidUpdate() {
    // If we just rendered a textarea, focus it
    if (this.ta) {
      this.ta.focus();
    }
  }

  startEditing = () => {
    this.clearHover();
    this.setState({editingExtant: true});
  }

  clearHover() {
    this.props.hover_cb(NOINDEX);
  }

  textAreaBlur = (e) => {
    // When the textarea loses focus, treat this as an intent to save unless
    // the thing gaining focus is the "cancel" button.
    if (e.relatedTarget && e.relatedTarget.id === "cancelEdit") {
      return;
    }
    this.onTextEdit();
  }

  render() {
    var filling;
    if (this.editing) {
      filling = (
        <div>
          <textarea 
          className="form-control lyrics"
          defaultValue={this.props.verse.raw} 
          onBlur={this.textAreaBlur}
          ref={(ta) => {this.ta = ta}}
          />
          
          <button className="btn" onClick={this.onTextEdit}>Save</button>
          <button id="cancelEdit" className="btn" onClick={this.abortEditing}>Cancel</button>
        </div>
      );
    } else {
      var lines = this.props.verse.lines.map(this.renderLine);
      filling = (
            <div className="words lyrics" 
              onClick={!this.props.verse.isFrozen() && this.startEditing} >
              {this.props.loading &&
                <h3>Loading...</h3>
              }
              {lines}
            </div>
      );
    }
    return (<div className="lyricsPane">
              <SongSelector 
                selected={this.props.slug}
              />
             {filling}
           </div>);
  }
}

LyricsPane.propTypes = {
  verse: React.PropTypes.object.isRequired,
  hover_cb: React.PropTypes.func,
  highlights: React.PropTypes.instanceOf(Map),
}

export default LyricsPane;

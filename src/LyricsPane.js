import React, { Component } from 'react';

import './LyricsPane.css';

import Word from './Word.js';

class LyricsPane extends Component {

  renderWord = (word) => {
    return (<Word i={word.i} key={word.i} raw={word.raw} 
                focus={this.props.highlights.get(word.i) || 0} 
                hover_cb={this.props.hover_cb}
            />);
  }

  renderLine = (line, idx) => {
    var words = line.map(this.renderWord);
    var x = [];
    // Hack to put spaces between word spans. We could just put them in the spans
    // themselves, but then we get funny underlining behaviour.
    for (let word of words) {
      x.push(word);
      x.push(" ");
    }
    return <div key={idx}>{x.slice(0,-1)}</div>;
  }

  render() {
    var lines = this.props.verse.lines.map(this.renderLine);
    return (
          <div className="words lyrics" 
            onClick={this.props.verse && this.props.verse.isCustom() && this.props.onEditButton} 
          >
            {this.props.loading &&
              <h3>Loading...</h3>
            }
            {lines}
          </div>
    );
  }
}

LyricsPane.propTypes = {
  verse: React.PropTypes.object.isRequired,
  loading: React.PropTypes.bool,
  hover_cb: React.PropTypes.func,
  highlights: React.PropTypes.instanceOf(Map),
};

export default LyricsPane;

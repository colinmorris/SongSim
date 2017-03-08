import React, { Component } from 'react';
import {hashHistory} from 'react-router';

import './SongSelector.css';

import {CUSTOM_SLUG} from './constants.js';
import { GROUPED_CANS } from './canned.js';
import CANNED_SONGS, { ORDERED_CATEGORIES } from './canned-data.js';
import {CannedVerse} from './verse.js';

  
class SongSelector extends Component {

  renderOption = (song) => {
    var text = (song.artist ? song.artist + " - " : "") + song.title;
    return (<option key={song.slug} value={song.slug}>
              {text}
            </option>);
  }

  handleChange = (e) => {
    // TODO: verify we're not already there?
    var slug = e.target.value;
    hashHistory.push(slug);
  }

  static lookupCanned(slug) {
    // TODO: should prolly just have a map
    for (let canned of CANNED_SONGS) {
      if (canned.slug === slug) {
        return canned;
      }
    }
    return undefined;
  }

  // TODO: this is basically a static variable 
  renderOptionGroups() {
    var res = [];
    // The first option is a special case: custom song
    if (this.props.allowEdit) {
      var custom = (<option key='custom' value={CUSTOM_SLUG}>Custom</option>);
      res.push(custom);
    }
    for (let cat of ORDERED_CATEGORIES) {
      let cans = GROUPED_CANS.get(cat.slug);
      cans = cans.filter((c) => (c.dropdown || c.slug === this.props.selected));
      if (cans.length === 0) continue;
      let og = (<optgroup key={cat.slug} label={cat.label}>
                  {cans.map(this.renderOption)}
                </optgroup>);
      res.push(og);
    }
    return res;
  }

  static loadSong(cb, canned) {
    var r = new XMLHttpRequest();
    var url = process.env.PUBLIC_URL + '/canned/' + canned.slug + '.txt';
    r.open('GET', url);
    r.onload = () => {
      var verse = CannedVerse.fromCanned(canned, r.response);
      cb(verse);
    };
    r.onerror = () => { console.error(`uh oh. Failed to fetch ${url}`); };
    r.send();
  }
  render() {
    // Apply some different effects to the button next to the dropdown depending
    // on whether we're talking about editing an existing custom song, or starting
    // a new one.
    var is_edit = this.props.selected === CUSTOM_SLUG;
    var glyph = is_edit ? 'pencil' : 'plus';
    var cust_title = is_edit ? 'Edit song' : 'New song';
    return (
            <div className="form-horizontal songselector">
              <div className="form-group">
              <div className="col-xs-11">
              <select className="form-control input-lg" 
                onChange={this.handleChange} value={this.props.selected} >
              {this.renderOptionGroups()}
              </select></div>
              {this.props.allowEdit &&
              <span className="col-xs-1 input-lg">
                <button className="btn" onClick={this.props.onEdit}
                  title={cust_title}
                >
                  <span className={"glyphicon glyphicon-" + glyph} />
                </button>
              </span>
              }
              </div>
            </div>
        );
  }
}

SongSelector.propTypes = {
  selected: React.PropTypes.string,
  onEdit: React.PropTypes.func,
  allowEdit: React.PropTypes.bool,
};

SongSelector.defaultProps = {
  allowEdit: true,
};

export default SongSelector;

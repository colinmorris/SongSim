import React, { Component } from 'react';
import {hashHistory} from 'react-router';

import './SongSelector.css';

import {CUSTOM_SLUG} from './constants.js';
import { GROUPED_CANS } from './canned.js';
import CANNED_SONGS from './canned-data.js';
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
    var custom = (<option key='custom' value={CUSTOM_SLUG}>Custom</option>);
    res.push(custom)
    for (let [group, cans] of GROUPED_CANS) {
      let og = (<optgroup key={group} label={group}>
                  {cans.map(this.renderOption)}
                </optgroup>);
      res.push(og);
    }
    return res;
  }

  static loadSong(cb, canned) {
    // TODO: hack
    var title = canned.title;
    var slug = canned.slug;
    var r = new XMLHttpRequest();
    var url = process.env.PUBLIC_URL + '/canned/' + slug + '.txt';
    console.log(`Loading ${url}`);
    r.open('GET', url);
    r.onload = () => {
      var verse = CannedVerse.fromCanned(canned, r.response);
      cb(verse);
    };
    r.onerror = () => { console.log("uh oh"); };
    r.send();
  }


  render() {
    // It's possible the "selected" slug we got was actually a firebase key,
    // in which case selected should be set to CUSTOM_SLUG
    var selected = this.props.selected;
    if (selected !== CUSTOM_SLUG) {
      var canned = SongSelector.lookupCanned(selected);
      if (!canned) {
        console.log("Couldn't find canned value for this slug. Assume firebase key.");
        selected = CUSTOM_SLUG;
      }
    }
    return (
            <div className="form-horizontal songselector">
              <div className="form-group">
              <div className="col-xs-11">
              <select className="form-control input-lg" 
                onChange={this.handleChange} value={selected} >
              {this.renderOptionGroups()}
              </select></div>
              <span className="col-xs-1 input-lg">
                <button className="btn" onClick={this.props.onEdit}
                  title="Edit custom song"
                >
                  <span className="glyphicon glyphicon-pencil" />
                </button>
              </span>
              </div>
            </div>
        );
  }
}

SongSelector.propTypes = {
  selected: React.PropTypes.string,
  onEdit: React.PropTypes.func,
};

export default SongSelector;

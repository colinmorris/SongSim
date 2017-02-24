import React, { Component } from 'react';
import {hashHistory} from 'react-router';

import './SongSelector.css';

import {CUSTOM_SLUG, CANNED_SONGS} from './constants.js';
import {CannedVerse} from './verse.js';

  
class SongSelector extends Component {

  renderOption = (song) => {
    var text = (song.artist ? song.artist + " - " : "") + song.title;
    return (<option key={song.slug} value={song.slug}>
              {text}
            </option>);
  }

  handleChange = (e) => {
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
    var groupMap = new Map();
    for (let c of CANNED_SONGS) {
      if (!groupMap.has(c.group)) {
        groupMap.set(c.group, []);
      }
      groupMap.get(c.group).push(c);
    }
    var res = [];
    // The first option is a special case: custom song
    var custom = (<option key='custom' value={CUSTOM_SLUG}>Custom</option>);
    res.push(custom)

    for (let [group, cans] of groupMap) {
      // sort groups alphabetically by artist (or title, if there's no artist)
      let cmp = (a,b) => {
        var keya = a.artist || a.title;
        var keyb = b.artist || b.title;
        return keya < keyb ? -1 : 
          (keyb < keya ? 1 : 0)
      };
      cans = cans.sort(cmp);
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
      var verse = new CannedVerse(r.response, slug, title, canned.artist);
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
              <select className="form-control input-lg" 
                onChange={this.handleChange} value={selected} >
              {this.renderOptionGroups()}
              </select>
        );
  }
}

export default SongSelector;

import React, { Component } from 'react';
import {hashHistory} from 'react-router';

import {CUSTOM_SLUG, CANNED_SONGS, DEFAULT_SONG} from './constants.js';
import {CannedVerse} from './verse.js';

  
class SongSelector extends Component {

  renderOption = (song) => {
    return (<option key={song.slug} value={song.slug}>
              {song.artist} - {song.title}
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
      // sort groups alphabetically by artist
      let cmp = (a,b) => {
        return a.artist < b.artist ? -1 : 
          (b.artist < a.artist ? 1 : 0)
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
    var selected = (this.props.selected.isCustom() ? 
                      CUSTOM_SLUG : this.props.selected.slug);
    return (
              <select className="form-control input-lg" 
                onChange={this.handleChange} value={selected} >
              {this.renderOptionGroups()}
              </select>
        );
  }
}

export default SongSelector;

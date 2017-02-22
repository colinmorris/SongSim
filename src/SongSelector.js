import React, { Component } from 'react';
import {hashHistory} from 'react-router';

import {CANNED_SONGS, DEFAULT_SONG} from './constants.js';
  
class SongSelector extends Component {

  renderOption = (song) => {
    return (<option key={song.fname} value={song.fname}>
              {song.artist} - {song.title}
            </option>);
  }

  handleChange = (e) => {
    // TODO: just use slugs everywhere, and tack on the extension when sending req
    var slug = e.target.value.slice(0, -1 * '.txt'.length);
    hashHistory.push(slug);
  }

  static lookupCanned(fname) {
    // Handle fnames with or without extension (URL slugs will have no extension)
    if (!fname.endsWith('.txt')) {
      fname += '.txt';
    }
    for (let canned of CANNED_SONGS) {
      if (canned.fname === fname) {
        return canned;
      }
    }
    return undefined;
  }

  static loadSong(cb, canned) {
    // TODO: hack
    var title = canned.title;
    var fname = canned.fname || DEFAULT_SONG;
    var r = new XMLHttpRequest();
    var url = process.env.PUBLIC_URL + '/canned/' + fname;
    console.log(`Loading ${url}`);
    r.open('GET', url);
    r.onload = () => {
      cb(r.response, title);
    };
    r.onerror = () => { console.log("uh oh"); };
    r.send();
  }


  render() {
    // TODO: hacky (parent should probably know the slug)
    var selected = DEFAULT_SONG;
    if (this.props.selectedTitle) {
      for (let c of CANNED_SONGS) {
        if (c.title === this.props.selectedTitle) {
          selected = c.fname;
          break;
        }
      }
    }
    this.selected = selected;
    return (<select onChange={this.handleChange} value={selected} >
              {CANNED_SONGS.map(this.renderOption)}
           </select>
        );
  }
}

export default SongSelector;

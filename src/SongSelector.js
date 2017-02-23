import React, { Component } from 'react';
import {hashHistory} from 'react-router';

import {CANNED_SONGS, DEFAULT_SONG} from './constants.js';
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
    var selected = this.props.selected || DEFAULT_SONG;
    return (<select onChange={this.handleChange} value={selected} >
              {CANNED_SONGS.map(this.renderOption)}
           </select>
        );
  }
}

export default SongSelector;

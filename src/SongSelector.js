import React, { Component } from 'react';
import {CANNED_SONGS, DEFAULT_SONG} from './constants.js';
  
class SongSelector extends Component {

  renderOption = (song) => {
    return (<option key={song.fname} value={song.fname}>
              {song.artist} - {song.title}
            </option>);
  }

  handleChange = (e) => {
    SongSelector.loadSong(this.props.onSelect, e.target.value);
  }

  static loadSong(cb, fname) {
    // TODO: hack
    var title;
    for (let canned of CANNED_SONGS) {
      if (canned.fname === fname) {
        title = canned.title;
      }
    }
    fname = fname || DEFAULT_SONG;
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
    return (<select onChange={this.handleChange} defaultValue={DEFAULT_SONG} >
              {CANNED_SONGS.map(this.renderOption)}
           </select>
        );
  }
}

export default SongSelector;

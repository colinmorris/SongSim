import React, { Component } from 'react';

class SongSelector extends Component {
  CANNED = [
    {fname: 'badromance.txt', artist: 'Lady Gaga', title: 'Bad Romance'},
    {fname: 'buddyholly.txt', artist: 'Weezer', title: 'Buddy Holly'},
  ]

  constructor(props) {
    super(props);
  }

  renderOption = (song) => {
    return (<option key={song.fname} value={song.fname}>{song.artist} - {song.title}</option>);
  }

  handleChange = (e) => {
    var r = new XMLHttpRequest();
    var url = process.env.PUBLIC_URL + '/canned/' + e.target.value;
    r.open('GET', url);
    r.onload = () => {
      this.props.onSelect(r.response);
    };
    r.onerror = () => { console.log("uh oh"); };
    r.send();
  }

  render() {
    return (<select onChange={this.handleChange}>
              {this.CANNED.map(this.renderOption)}
           </select>
        );
  }
}

export default SongSelector;

import React, { Component } from 'react';
  
var CANNED_SONGS = [
  {fname: 'badromance.txt', artist: 'Lady Gaga', title: 'Bad Romance'},
  {fname: 'buddyholly.txt', artist: 'Weezer', title: 'Buddy Holly'},
  {fname: 'barbiegirl.txt', artist: 'Aqua', title: 'Barbie Girl'},
  {fname: 'cgyoomh.txt', artist: 'Kylie Minogue', title: "Can't Get You Out Of My Head"},
  {fname: 'humps.txt', artist: 'The Black-eyed Peas', title: 'My Humps'},
  {fname: 'judas.txt', artist: 'Lady Gaga', title: 'Judas'},
  {fname: 'plan.txt', artist: 'They Might Be Giants', title: 'No-one Knows My Plan'},
  {fname: 'spiderwebs.txt', artist: 'No Doubt', title: 'Spiderwebs'},
  {fname: 'theechoinggreen.txt', artist: 'William Blake', title: 'The Echoing Green'},
  {fname: 'thelamb.txt', artist: 'William Blake', title: 'The Lamb'},
  {fname: 'thepasture.txt', artist: 'Robert Frost', title: 'The Pasture'},
  {fname: 'thetyger.txt', artist: 'William Blake', title: 'The Tyger'},
  {fname: 'peaches.txt', artist: 'The Presidents of the United States of America', title: 'Peaches'},
  {fname: 'test.txt', artist: 'colinmorris', title: 'test'},
  {fname: 'gottobereal.txt', artist: 'Cheryl Lynn', title: 'Got To Be Real'},
  {fname: 'mysharona.txt', artist: 'The Knack', title: 'My Sharona'},
  {fname: 'stuckin.txt', artist: 'that guy', title: 'Stuck In The Middle With You'},
  {fname: 'lovefool.txt', artist: 'The Cardigans', title: 'Lovefool'},
  {fname: 'sugarsugar.txt', artist: 'The Archies', title: 'Sugar Sugar'},
  {fname: 'killvmaim.txt', artist: 'Grimes', title: 'Kill v Maim'},
  {fname: 'ibleed.txt', artist: 'The Pixies', title: 'I Bleed'},
  {fname: 'ribs.txt', artist: 'Lorde', title: 'Ribs'},
  {fname: 'hardestbutton.txt', artist: 'The White Stripes', title: 'The Hardest Button To Button'},
  {fname: 'cheapthrills.txt', artist: 'Sia', title: 'Cheap Thrills'},
  {fname: 'anthems.txt', artist: 'bss', title: 'anthems'},
  {fname: 'debaser.txt', artist: 'pixies', title: 'Debaser'},
  {fname: 'praiseyou.txt', artist: 'fbslim', title: 'Praise You'},
  {fname: 'badgirls.txt', artist: 'M.I.A.', title: 'Bad Girls'},
  {fname: 'team.txt', artist: 'Lorde', title: 'Team'},
  {fname: 'royals.txt', artist: 'Lorde', title: 'Royals'},
  {fname: 'whereismymind.txt', artist: 'Pixies', title: 'Where'},
  {fname: 'chandelier.txt', artist: 'Sia', title: 'Chandelier'},
  {fname: 'sexotheque.txt', artist: 'La Roux', title: 'Sexotheque'},
  {fname: 'wouldntitbenice.txt', artist: 'The Beach Boys', title: "Wouldn't It Be Nice?"},
  
  //{fname: '.txt', artist: '', title: ''},
];

var DEFAULT_SONG = 'plan.txt';
//var DEFAULT_SONG = 'test.txt';

class SongSelector extends Component {

  constructor(props) {
    super(props);
  }

  renderOption = (song) => {
    return (<option key={song.fname} value={song.fname}>
              {song.artist} - {song.title}
            </option>);
  }

  handleChange = (e) => {
    SongSelector.loadSong(this.props.onSelect, e.target.value);
  }

  static loadSong(cb, fname) {
    fname = fname || DEFAULT_SONG;
    var r = new XMLHttpRequest();
    var url = process.env.PUBLIC_URL + '/canned/' + fname;
    console.log(`Loading ${url}`);
    r.open('GET', url);
    r.onload = () => {
      cb(r.response);
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

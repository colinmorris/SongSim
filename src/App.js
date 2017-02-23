import React, { Component } from 'react';
import './App.css';
import Songsim from './Songsim.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Songsim songId={this.props.params.songId} />
      </div>
    );
  }
}

export default App;

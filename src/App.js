import React, { Component } from 'react';
import './App.css';
import Songsim from './Songsim.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>SongSim</h2>
        </div>
        <Songsim />
      </div>
    );
  }
}

export default App;

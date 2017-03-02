import React, { Component } from 'react';
import { Link } from 'react-router';
import './App.css';
import octocat from './octocat.svg';

const LINKS = [
  {path: "/", name: "Songsim"},
  {path: "/about", name: "About"},
  {path: "/gallery", name: "Gallery"}
];

class App extends Component {
  renderNavLink = (link) => {
    // I'm sure there's a better way to do this...
    let active = link.path === "/" ? 
        !LINKS.some((l) => 
            ( l.path !== "/" && this.props.location.pathname.startsWith(l.path))
        )
        : 
        this.props.location.pathname.startsWith(link.path)
    ;
    return (<li className={active ? "active" : ""}
            key={link.name}
          >
            <Link to={link.path}>{link.name}</Link></li>);
  }
  render() {
    var links = LINKS.map(this.renderNavLink);
    return (
      <div className="App">
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <ul className="nav navbar-nav">
              {links}
              <li className="octo">
                <a href="https://github.com/colinmorris/SongSim">
                  <img alt="fork me on GitHub" src={octocat} />
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {this.props.children}

      </div>
    );
  }
}

export default App;

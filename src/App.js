import React, { Component } from 'react';
import { Link } from 'react-router';
import './App.css';

const LINKS = [
  {path: "/", name: "Songsim"},
  {path: "/about", name: "About"},
  {path: "/gallery", name: "Gallery"}
];

class App extends Component {
  renderNavLink = (link) => {
    return (<li className={this.props.location.pathname === link.path ? "active" : ""}
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
            </ul>
          </div>
        </nav>

        {this.props.children}
      </div>
    );
  }
}

export default App;

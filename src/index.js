import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import About from './About.js';
import Gallery from './Gallery.js';
import {Router, Route, hashHistory} from 'react-router';
import './index.css';

import 'react-resizable/css/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/css/bootstrap-theme.css';

ReactDOM.render(
  (<Router history={hashHistory}>
    <Route path="/about(/:chapter)" component={About} />
    <Route path="/gallery" component={Gallery} />
    <Route path="/(:songId)" component={App} />
  </Router>),
  document.getElementById('root')
);

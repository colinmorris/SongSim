import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import About from './About.js';
import {Router, Route, hashHistory} from 'react-router';
import './index.css';

import 'react-resizable/css/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/css/bootstrap-theme.css';

ReactDOM.render(
  (<Router history={hashHistory}>
    <Route path="/about" component={About} />
    <Route path="/(:songId)" component={App} />
  </Router>),
  document.getElementById('root')
);

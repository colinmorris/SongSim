import React from 'react';
import ReactDOM from 'react-dom';
import Home from './routes/home';
import About from './routes/about';
import Gallery from './routes/gallery';
import Songsim from './components/songsim';
import { IndexRoute, Router, Route, hashHistory } from 'react-router';
import './index.css';

import 'react-resizable/css/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/css/bootstrap-theme.css';

ReactDOM.render(
  (<Router history={hashHistory}>
      <Route path="/" component={Home} >
      <Route path="about(/:chapter)" component={About} />
      <Route path="gallery(/:cat)" component={Gallery} />
      <Route path="custom(/:customKey)" component={Songsim} />
      <Route path="(:songId)" component={Songsim} />
      <IndexRoute component={Songsim} />
    </Route>
  </Router>),
  document.getElementById('root')
);

import React, { Component } from 'react';
import { Link } from 'react-router';

import './Gallery.css';

import { GROUPED_CANS } from './canned.js';

const GALLERY_FILE_PATH = '/img/gallery/'

class Gallery extends Component {

  renderCanned = (c) => {
    return (
        <div key={c.slug} className="col-xs-4 col-lg-3">
          <div className="galleryFrame">
          <img className="img-responsive" 
            src={process.env.PUBLIC_URL + GALLERY_FILE_PATH + c.slug + '.png'}
            />
          <div className="galleryLabel"><Link to={c.href}>{c.tagline}</Link>
          </div>
          </div>
        </div>
    );
  }

  renderGroup = (group, cans) => {
    var pics = cans.map(this.renderCanned);
    return (
        <div key={group}>
          <h3>{group}</h3>
          <div className="row">
            {pics}
          </div>
        </div>
    );
  }

  render() {
    var groups = Array.from(GROUPED_CANS.entries()).map( (kv) => (this.renderGroup(kv[0], kv[1])) );
    return (
        <div className="container">
          {groups}
        </div>
        );
  }
}

export default Gallery;

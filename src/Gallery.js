import React, { Component } from 'react';
import { Link } from 'react-router';
import Lightbox from 'react-image-lightbox';

import './Gallery.css';

import { GROUPED_CANS } from './canned.js';

const GALLERY_FILE_PATH = '/img/gallery/'

class Gallery extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lightbox_index: -1,
    };
  }

  renderCanned = (c, i) => {
    return (
        <div key={c.slug} className="col-xs-4 col-lg-3">
          <div className="galleryFrame">
            <img className="img-responsive" 
              alt={`Self-similarity matrix of ${c.title} by ${c.artist}`}
              onClick={(e) => {
                this.setState({lightbox_index: i})
              }}              
              src={this.cannedSrc(c)}
              />
              {this.cannedCaption(c, "galleryLabel")}
          </div>
        </div>
    );
  }

  cannedCaption = (c, kls) => {
    return <div className={kls}><Link to={c.href}>{c.tagline}</Link></div>;
  }

  cannedSrc = (c) => {
    return process.env.PUBLIC_URL + GALLERY_FILE_PATH + c.slug + '.png';
  }

  renderGroup = (group, cans, offset) => {
    var pics = cans.map((can, i) => {
      return this.renderCanned(can, offset+i);
    });
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
    var i = 0;
    var sections = [];
    var flatcans = [];
    for (let [group, cans] of GROUPED_CANS.entries()) {
      sections.push(this.renderGroup(group, cans, i));
      i += cans.length;
      flatcans = flatcans.concat(cans);
    }
    var lightbox;
    if (this.state.lightbox_index !== -1) {
      let li = this.state.lightbox_index;
      let can = flatcans[this.state.lightbox_index];
      let next = this.state.lightbox_index < flatcans.length-1 ? flatcans[li+1] : undefined;
      let prev = this.state.lightbox_index > 0 ? flatcans[li-1] : undefined;
      lightbox = (
        <Lightbox
          mainSrc={this.cannedSrc(can)}
          nextSrc={next && this.cannedSrc(next)}
          prevSrc={prev && this.cannedSrc(prev)}
          imageCaption={this.cannedCaption(can)}
          onCloseRequest={() => {
            this.setState({lightbox_index: -1});
          }}
          onMoveNextRequest={() => {
            this.setState({lightbox_index: this.state.lightbox_index+1});
          }}
          onMovePrevRequest={() => {
            this.setState({lightbox_index: this.state.lightbox_index-1});
          }}
          animationDisabled={true}
      />
      );
    }
    return (
        <div className="container">
          {sections}
          {lightbox}
        </div>
        );
  }
}

export default Gallery;

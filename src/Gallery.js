import React, { Component } from 'react';
import { Link } from 'react-router';
import Lightbox from 'react-image-lightbox';

import './Gallery.css';

import { Canned, GROUPED_CANS } from './canned.js';
import CANNED_SONGS, { ORDERED_CATEGORIES } from './canned-data.js';

const GALLERY_FILE_PATH = '/img/gallery/';

const DEFAULT_CAT_SLUG = ORDERED_CATEGORIES[0].slug;

class Gallery extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lightbox_index: -1,
    };
  }

  get cat() {
    return this.props.params.cat || DEFAULT_CAT_SLUG;
  }

  componentDidMount() {
    document.title = "Gallery - SongSim";
  }

  renderCanned = (c, i) => {
    let kls = "img-responsive";
    if (c.mini) {
      kls += " mini";
    }
    return (
        <div key={c.slug} className="col-xs-4 col-lg-3">
          <div className="galleryFrame">
            <img className={kls} 
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

  songsForCat(cat) {
    if (cat !== 'all') {
      return GROUPED_CANS.get(cat);
    }
    var flatcans = [];
    for (let cans of GROUPED_CANS.values()) {
      flatcans = flatcans.concat(cans);
    }

  }

  render() {
    var songs;
    if (this.cat === 'all') {
      // blargh
      songs = CANNED_SONGS.map((o) => (new Canned(o)));
      songs = songs.sort(Canned.comparator);
    } else {
      songs = GROUPED_CANS.get(this.cat);
      songs = songs.filter((c) => (!c.hidden));
    }
    var imgs = songs.map(this.renderCanned);
    var cats = [{label: 'All', slug: 'all'}].concat(ORDERED_CATEGORIES);
    var pills = cats.map((cat) => (
          <li key={cat.slug} className={this.cat === cat.slug ? "active" : ""}>
            <Link to={"/gallery/"+cat.slug}>{cat.label}</Link>
          </li>
    ));
    var nav = (
        <ul className="nav nav-tabs">
          {pills}
        </ul>
    );
    var lightbox;
    if (this.state.lightbox_index !== -1) {
      let li = this.state.lightbox_index;
      let can = songs[this.state.lightbox_index];
      let next = this.state.lightbox_index < songs.length-1 ? songs[li+1] : undefined;
      let prev = this.state.lightbox_index > 0 ? songs[li-1] : undefined;
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
          {nav}
          <div className="row">
            {imgs}
          </div>
          {lightbox}
        </div>
        );
  }
}

export default Gallery;

import React, { Component } from 'react';
import { Link } from 'react-router';

import './About.css';

class About extends Component {

  renderSection = (s) => {
    var paras = s.paras.map( (p, i) => {
      return <p key={i}>{p}</p>;
    });
    return (
          <div key={s.img} className="section row">
              <div className="col-xs-12 col-lg-6 col-md-8">
                <img className="img-responsive"
                  src={process.env.PUBLIC_URL + '/img/' + s.img} />
              </div>
              <div className="col-xs-12 col-lg-6 col-md-4">
              {paras}
              </div>
            </div>);
  }

  render() {
    var sections = SECTIONS.map(this.renderSection);
    return (
      <div className="container">
        <Link to="/">Home</Link>
        <h1>About</h1>
        {sections}
      </div>);
  }
}

const SECTIONS = [
  {img: 'baa1.png', paras: [
      'A self-similarity matrix is used to answer the question "which parts of this thing are alike?".',
      'Each row and column of the matrix corresponds to a word in a text. This 35 x 35 matrix represents the 35 words of "Baa Baa Black Sheep". The cell at (x, y) is filled in if the xth word and the yth word are the same.',
      'The diagonal running from top-left to bottom-right corresponds to cases where x=y, and is always filled in. The portions on either side of it are symmetric.',
    ]},
  {img: 'baa_the.png', paras: [
      'Single squares off the main diagonal like this represent words that are used repeatedly in the song (in this case, "the", which is used 4 times).',
      'You can hide these by checking the "Ignore single-word matches" box.'
    ]},
  {img: 'baa_oneforthe.png', paras: [
      'Diagonal lines represent repeated sequences of words. "one for the" appears 3 times.'
    ]},
  {img: 'baa_colorful.png', paras: [
      '"Colorful" mode assigns a unique color to each repeated word. When there are several repeated themes, this can make it easier to distinguish them.'
    ]},
  {img: 'baa_siryes.png', paras: [
      'Diagonals close to the main diagonal represent nearby repetitions ("yes sir, yes sir").'
    ]},

  //{img: 'baa_colortitle.png', paras: []},
  // TODO: blocks of repeated words, custom songs, color title mode, "advanced tips"
]

export default About;

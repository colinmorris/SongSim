import React, { Component } from 'react';
import { Link } from 'react-router';

import './About.css';

class About extends Component {

  renderSection = (s) => {
    var paras = s.paras.map( (p, i) => {
      if (typeof p === 'string') {
        return <p key={i}>{p}</p>;
      }
      // Otherwise assumed to be jsx returning fn
      return p(i);
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
    var chapter = this.props.params.chapter || 'default';
    var sections = SECTIONS[chapter].map(this.renderSection);
    return (
      <div className="container">
        <Link to="/">Home</Link>
        <h1>About</h1>
        <ul className="nav nav-tabs">
          <li className={chapter === 'default' ? 'active' : ''}>
            <Link to="/about">About</Link>
          </li>
          <li className={chapter === 'intro' ? 'active' : ''}>
            <Link to="/about/intro">Tutorial</Link>
          </li>
          <li className={chapter === 'advanced' ? 'active' : ''}>
            <Link to="/about/advanced">Advanced</Link>
          </li>
        </ul>
        {sections}
      </div>);
  }
}

const SECTIONS = 
{
'default': [
  {img: 'barbie.png', paras: [
    (k) => (<p key={k}>SongSim uses <Link to="https://en.wikipedia.org/wiki/Self-similarity_matrix">self-similarity matrices</Link> to visualize patterns of repetition in text. The cell at position (x, y) is filled in if the xth and yth words of the song are the same.</p>),
    (k) => (<p key={k}>For more details, check out the <Link to="/about/intro">tutorial</Link>.</p>)
    ]},
],
'intro':
  [
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
],
'advanced': [
  {img: 'wimm_stripes.png', paras: [
    (k) => (
      <p key={k}><b>"Stripey Squares"</b> correspond to a chanted phrase. The example on the left is from the Pixies' <Link to="/whereismymind">"Where is my Mind"</Link> the chorus of which is "Where is my mind / Where is my mind / Where is my mind".</p>),
    'The distance between the stripes increases with the length of the repeated phrase.'
  ]},
  {img: 'royals_cb.png', paras: [
    (k) => (
      <p key={k}><b>Checkerboards</b> are a special case of the above pattern where the length of the repeated phrase is two words.</p>),
  ]},
  // Epizeuxis
  {img: 'cgyoomh_blocks.png', paras: [
    (k) => (
      <p key={k}><b>Filled-in blocks</b> are another special case of the above, where what's chanted is just a single word.</p>),
    ]},
  {img: 'badromance_trunc.png', paras: [
    (k) => (
      <p key={k}><b>Short, recurrent diagonals</b> represent some phrase that 
      the artist is riffing on. The matrix to the left is the beginning of Lady 
      Gaga's "Bad Romance", up to the end of the first chorus. The short repeated
      lines correspond to "I want your", which begins virtually every line of the first
      verse ("I want your ugly / I want your disease / I want your everything..."). (In rhetoric, this is called <Link to="https://en.wikipedia.org/wiki/Anaphora_(rhetoric)">anaphora</Link>.)</p>),
    ]}
]
}

  //{img: 'baa_colortitle.png', paras: []},
  // TODO: blocks of repeated words, custom songs, color title mode, "advanced tips"

export default About;

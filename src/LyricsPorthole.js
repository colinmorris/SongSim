import React, { Component } from 'react';

import './LyricsPorthole.css';


class LyricsPorthole extends Component {

  renderContext(dir, ax) {
    const ctx = 10;
    var diag = this.props.focal;
    var start = (ax === 'x' ?
        (dir === -1 ? diag.x0 : diag.x1)
        :
        (dir === -1 ? diag.y0 : diag.y1)
    );
    start += dir;
    var end = start + (dir * ctx);
    var txt = this.props.verse.textInRange(
        Math.min(start, end), 
        Math.max(start, end)
    );
    var paras = [];
    if (dir === 1 && txt.length && txt[0].startsWith('...')) {
      paras = [<p className="continuation" key="c">{txt[0]}</p>];
      paras = paras.concat(this.parify(txt.slice(1)));
    } else {
      paras = this.parify(txt);
    }
    return (
        <div>
          {paras}
        </div>
    );
  }

  parify = (txts) => {
    return txts.map((t, i) => (<p key={i}>{t}</p>));
  }

  render() {
    var diag = this.props.focal;
    if (!diag) {
      return <div className="porthole" />;
    }
    var inner;
    inner = this.props.verse.diagText(diag);  
    inner = this.parify(inner);
    return (
      <div className="porthole">
        <div className="row">
          <div className="col-xs-6">
            <b>x:</b>{this.renderContext(-1, 'x')}
          </div>
          <div className="col-xs-6">
            <b>y:</b>{this.renderContext(-1, 'y')}
          </div>
        </div>

        <div className="row matchText">
          {inner}
        </div>
        
        <div className="row">
          <div className="col-xs-6">
            {this.renderContext(1, 'x')}
          </div>
          <div className="col-xs-6">
            {this.renderContext(1, 'y')}
          </div>
        </div>
      </div>
    );
  }
}

export default LyricsPorthole;

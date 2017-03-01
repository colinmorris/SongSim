import React, { Component } from 'react';
import Clipboard from 'clipboard';

import config from './config.js';
import {MODE} from './constants.js';

// TODO: is this really the orthodox way to do this? :/
new Clipboard('#perma');

/**
 * Contains a bunch of controls for stuff like:
 * - setting matrix coloring mode
 * - whether to ignore singletons
 * - saving svg file
 * - sharing/permalinks
 * Separating this stuff into a component separate from Songsim involves some
 * spooky action at a distance, but I think it's worth it to simplify Songsim,
 * particularly its render method.
 */
class Toolbox extends Component {
  
  renderModeRadio = (mode_key) => {
    var mode = MODE[mode_key];
    // TODO: Really when we get a change to state.verse, we should see if
    // the new verse is custom && mode is color_title, and if so, we should
    // automatically switch to a different mode. But bleh.
    var disabled = (mode === MODE.color_title && 
        (!this.props.verse || !this.props.verse.title));
    var divCname = disabled ? "radio-inline disabled" : "radio-inline";
    return (
        <div className={divCname} key={mode}>
          <label><input type="radio" 
              disabled={disabled}
              checked={this.props.mode === mode}
              value={mode}
              onChange={(e) => {
                this.props.onStateChange({mode: e.target.value})
              }}
              name="mode" />
            {mode}
          </label>
        </div>
    );
  }

  renderSingletonRadios = () => {
    var singstop = [this.props.ignoreSingletons, this.props.ignore_stopwords];
    var modes = [
      {label: 'show all', ss: [false, false]},
      {label: 'ignore all', ss: [true, false]},
      {label: 'ignore stopwords', ss: [false, true]},
    ];
    var radios = [];
    for (let mode of modes) {
      radios.push((
          <label key={mode.label}>
            <input type="radio"
              checked={singstop[0] === mode.ss[0] && singstop[1] === mode.ss[1]}
              value={mode.ss}
              onChange={(e) => {
                this.props.onStateChange({ignore_singletons: mode.ss[0], 
                  ignore_stopwords: mode.ss[1]});
              }}
              />
            {mode.label}
          </label>
      ));
    }
    return (
        <div className="col-xs-4 col-md-4">
          <label>Single-word matches</label>
          <form className="form-control">
          {radios}
          </form>
        </div>
    );
  }

  renderSave = () => {
    if (this.props.verse && config.exportSVGEnabled && this.props.exportSVG) {
      return (
          <div className="col-xs-2 col-md-1">
          <button className="btn"
            onClick={this.props.exportSVG}    
            title="Save matrix as SVG file"
          >
            <span className="glyphicon glyphicon-save" />
          </button>
          </div>
      );
    }
  }

  renderPermalink = () => {
    if (!(this.props.verse && this.props.verse.isCustom() && !this.props.verse.isBlank())) {
      return;
    }
    var perma = this.props.verse.permalink;
    if (perma) {
      return (
          <div className="col-xs-2 col-md-2">
            <label>
              Permalink:
              <input 
                type="text" readOnly={true} 
                value={this.props.verse.permalink} />
            <button id="perma" className="btn" data-clipboard-text={this.props.verse.permalink}>
              <span className="glyphicon glyphicon-paperclip" />
            </button>
            </label>
          </div>
      );
    } else {
      return (
        <div className="col-xs-2 col-md-1">
          <button className="btn" onClick={this.props.onShare}>
            Export
          </button>
        </div>
      );
    }
  }

  render() {
    var moderadios = Object.keys(MODE).map(this.renderModeRadio);
    return (
        <div className="form-horizontal">

          <div className="col-xs-4">
            <label>
              Mode
              <form className="form-control">
                {moderadios}
              </form>
            </label>
          </div>

          {this.renderSave()}
          {this.renderPermalink()}
          {this.renderSingletonRadios()}

        </div>
    );
  }
}

Toolbox.propTypes = {
  verse: React.PropTypes.object,
}

export default Toolbox;

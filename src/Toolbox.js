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

  renderSave = () => {
    if (this.props.verse && config.exportSVGEnabled && this.props.exportSVG) {
      return (
          <button className="btn"
            onClick={this.props.exportSVG}    
            title="Save matrix as SVG file"
          >
            <span className="glyphicon glyphicon-save" />
          </button>
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
          <div className="form-group">
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
        <div>
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
        <div className="row">

          <div className="form-group">
            <label>
              Mode
              <form className="form-control">
                {moderadios}
              </form>
            </label>

            <div className="checkbox">
              <label>
                <input type="checkbox" checked={this.props.ignore_singletons}
                  onChange={(e) => {
                    this.onStateChange({ignore_singletons: e.target.checked});
                  }}
                />
                Ignore single-word matches
              </label>
            </div>

            {this.renderSave()}
            {this.renderPermalink()}

          </div> {/* /form-group */}

        </div>
    );
  }
}

Toolbox.propTypes = {
  verse: React.PropTypes.object,
}

export default Toolbox;

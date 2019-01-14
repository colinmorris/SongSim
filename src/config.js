import {MODE} from './constants.js';

var config = {
  alleys: true, 
  default_mode: MODE.vanilla,
  debug: false,
  exportSVGEnabled: true,
  checkerboard: true,
  testingFBKey: '-KeAcPBicxmHgZNEY9UM',
  base_title: 'SongSim',
  // Make sure the two options below sum to 1. (I know, this is dumb. Too lazy to refactor.)
  stopwords: false,
  default_ignore_singletons: true,
};

export default config;

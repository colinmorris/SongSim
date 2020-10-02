import {MODE} from './constants.js';

const config = {
  alleys: true, 
  default_mode: MODE.vanilla,
  debug: true,
  exportSVGEnabled: true,
  checkerboard: true,
  rect_saturation: 100, // range [0-100]
  rect_lightness: 50, // range [0-100]
  testingFBKey: '-KeAcPBicxmHgZNEY9UM',
  base_title: 'SongSim',
  // Make sure the two options below sum to 1. (I know, this is dumb. Too lazy to refactor.)
  stopwords: false,
  default_ignore_singletons: true,
};

export default config;

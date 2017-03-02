var MODE = {
  vanilla: 'black & white',
  colorful: 'colorful',
  color_title: 'color title',
};

const MODE_TOOLTIPS = {
  colorful: 'Assigns a unique colour to each word that occurs at least once in the song.',
  color_title: 'Color squares corresponding to words in the title of the song.',
}

var NOINDEX = -1;

var CUSTOM_SLUG = 'custom';

// TODO: use me
var STOPWORDS = new Set([
  'i', 'you', 'the', 'a', 'to', 'me', 'my', "i'm", 'your', 'in', 'and', 'it',
  'that', 'on', 'be', 'is', 'with', 'of', 'as',
]);

export {STOPWORDS, NOINDEX, MODE, MODE_TOOLTIPS, CUSTOM_SLUG};

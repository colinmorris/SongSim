import {Diagonal} from './utils.js';

/**
 * A chunk of text, presumably some kind of poem/song.
 */
class Verse {
  constructor(text) {
    this.parse(text);
  }

  static cleanWord(word) {
    // TODO: punctuation
    return word.toLowerCase(); 
  }

  parse(text) {
    // TODO: portable newlines?
    var raw_words = [];
    var clean_words = [];
    var newlines = [];
    for (const line of text.split("\n")) {
      for (const word of line.trim().split(/\s+/)) {
        raw_words.push(word);
        clean_words.push(Verse.cleanWord(word));
      }
      newlines.push(clean_words.length - 1);
    }
    this.raw_words = raw_words;
    this.clean_words = clean_words;
    this.newline_indices = newlines;
  }

  get lines() {
    var lines = []
    var i = 0;
    for (const eol of this.newline_indices) {
      var line = [];
      // TODO: this is stupid, don't need a loop
      for (; i <= eol; i++) {
        line.push({i: i, raw: this.raw_words[i]});
      }
      lines.push(line);
    }
    return lines;
  }

  get matrix() {
    return new VerseMatrix(this.clean_words);
  }
}

/** TODO: the naive approach here is probably wildly inefficient.
 * Is there some js implementation of bitstrings I could use here?
 */
class VerseMatrix {
  constructor(words) {
    this.length = words.length;
    this.adjacency_list = [];
    for (var x=0; x < words.length; x++) {
      for (var y=0; y < words.length; y++) {
        // TODO: wasteful to include diagonal and both reflections off diag
        if (words[x] == words[y]) {
          this.adjacency_list.push({x, y});
        }
      }
    }
  }

  at(x, y) {
    // TODO: sooo unoptimized
    return this.adjacency_list.some((pt) => { return pt.x == x && pt.y == y });
  }

  local_diagonal(x, y) {
    var x0 = x, x1 = x;
    var y0 = y, y1 = y;
    // Don't do anything further if this point is on the main diagonal.
    if (x !== y) {
      // Probe up and left
      for (let x_ = x, y_ = y; x_ >= 0 && y_ >= 0 && this.at(x_, y_); x_--, y_--) {
        x0 = x_;
        y0 = y_;
      }
      // Probe down and to the right
      for (let x_ = x, y_ = y; x_ < this.length && y_ < this.length 
          && this.at(x_, y_); x_++, y_++) {
        x1 = x_;
        y1 = y_;
      }
    }
    return new Diagonal(x0, y0, x1, y1);
  }

}

export {Verse, VerseMatrix};

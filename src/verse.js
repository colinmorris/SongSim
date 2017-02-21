import {Diagonal} from './utils.js';

/**
 * A chunk of text, presumably some kind of poem/song.
 */
class Verse {
  constructor(text) {
    this.parse(text);
  }

  static cleanWord(word) {
    var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
    word = word.toLowerCase(); 
    var depuncd = word.replace(punctRE, '');
    // If this word is *all* punctuation, then leave it alone.
    return depuncd || word;
  }

  parse(text) {
    // TODO: portable newlines?
    var raw_words = [];
    var clean_words = [];
    var newlines = [];
    var skipped = 0;
    var word_ids = new Map();
    for (const line of text.split(/[\n\r]+/)) {
      for (const word of line.trim().split(/\s+/)) {
        if (!word) {
          skipped ++;
          continue;
        }
        raw_words.push(word);
        var cleaned = Verse.cleanWord(word);
        clean_words.push(cleaned);
        var count = word_ids.has(cleaned) ? word_ids.get(cleaned)+1 : 1;
        word_ids.set(cleaned, count);
      }
      newlines.push(clean_words.length - 1);
    }
    console.log(`Skipped ${skipped} empty words`);
    this.raw_words = raw_words;
    this.clean_words = clean_words;
    this.newline_indices = newlines;
    let RANDOMIZE = false;
    let IGNORE_HAPAX = true;
    var next_idx = 0;
    var nWords = 0;
    for (let [word, count] of word_ids) {
      if (IGNORE_HAPAX && count == 1) {
        word_ids.set(word, -1);
      } else {
        word_ids.set(word, next_idx++);
        nWords++;
      }
    }
    if (RANDOMIZE) {
      console.warn("this is broken now");
      this.word_ids = this.scramble(word_ids);
    } else {
      this.word_ids = word_ids;
    }
    this.nWords = nWords;
    console.log(`Found ${word_ids.size} unique words out of ${clean_words.length}`);
  }

  scramble(wids) {
    var words = Array.from(wids.keys());
    for (let i=words.length; i>0; i--) {
      let j = Math.floor(Math.random() * i);
      [words[i-1], words[j]] = [words[j], words[i-1]];
    }
    let res = new Map();
    for (let i=0; i < words.length; i++) {
      res.set(words[i], i);
    }
    return res;
  }



  uniqueWordId(idx) {
    return this.word_ids.get(this.clean_words[idx]);
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
    this.adjacency_map = new Array(this.length);
    for (var x=0; x < words.length; x++) {
      for (var y=0; y < words.length; y++) {
        // TODO: wasteful to include diagonal and both reflections off diag
        if (words[x] == words[y]) {
          this.set_pair(x, y);
        }
      }
    }
  }

  set_pair(x, y) {
    this.adjacency_list.push({x, y});
    if (this.adjacency_map[x] === undefined) {
      this.adjacency_map[x] = new Set();
    }
    this.adjacency_map[x].add(y);
  }

  /** Return whether the words at the given indices match. */
  at(x, y) {
    if (x < 0 || this.length <= x || y < 0 || this.length <= y) {
      return false;
    }
    return this.adjacency_map[x].has(y);
  }

  /** Return the diagonal that contains the given point. Behaviour undefined if
   * there's no match at (x, y), or if x == y. */
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

  * matches_for_index(i) {
    for (let y = 0; y < this.length; y++) {
      if (y === i) continue;
      if (this.at(i, y)) {
        yield y;
      }
    }
  }

  /** Does the given diagonal exist in this matrix? */
  containsDiagonal(diag) {
    for (let [x, y] of diag.points()) {
      if (!this.at(x, y)) return false;
    }
    return true;
  }

  /** Extant diagonals in this matrix which are translations of the given
   * diagonal in the x or y direction and not on the main diagonal. Plus 
   * the main diagonal correlates of *those* diagonals. 
   */
  * incidental_correlates(diag) {
    for (let x of this.matches_for_index(diag.y0)) {
      var cor = Diagonal.fromPointAndLength(x, diag.y0, diag.length);
      if (this.containsDiagonal(cor)) {
        yield cor;
        yield cor.down_main();
      }
    }
    for (let y of this.matches_for_index(diag.x0)) {
      var cor = Diagonal.fromPointAndLength(diag.x0, y, diag.length);
      if (this.containsDiagonal(cor)) {
        yield cor;
        yield cor.side_main();
      }
    }
  }

}

export {Verse, VerseMatrix};

import {Diagonal} from './utils.js';
import {CUSTOM_SLUG} from './constants.js';

/** A sequence of repeated words. */
class Lala {
  constructor(start, end, word) {
    this.start = start;
    this.end = end;
    this.word = word;
    this.length = 1 + (this.end - this.start);
  }

  includes(i) {
    return (this.start <= i && i <= this.end);
  }
}

class VerseMatrix {
  /** TODO: implementation isn't *totally* naive at this point, but is still
   * probably pretty darn inefficient. Might be worth thinking about faster/
   * more compact data structures at some point. But, in practice, it seems 
   * like the dominating perf concern is just the number of elements (rects)
   * we're drawing, not our js objects/methods. */
  constructor(words) {
    this.length = words.length;
    this.adjacency_list = [];
    this.adjacency_map = new Array(this.length);
    for (var x=0; x < words.length; x++) {
      for (var y=0; y < words.length; y++) {
        // TODO: wasteful to include diagonal and both reflections off diag
        if (words[x] === words[y]) {
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

  /** Precondition: (x, y) is in the adjacency list **/
  is_singleton(x, y) {
    return (x !== y && !this.at(x-1, y-1) && !this.at(x+1,y+1));
  }

  /** Return the diagonal that contains the given point. Behaviour undefined if
   * there's no match at (x, y), or if x == y. */
  local_diagonal(x, y) {
    var x0 = x, x1 = x;
    var y0 = y, y1 = y;
    // Don't do anything further if this point is on the main diagonal.
    if (x !== y) {
      // Probe up and left
      for (let x_ = x-1, y_ = y-1; x_ >= 0 && y_ >= 0 && this.at(x_, y_); x_--, y_--) {
        x0 = x_;
        y0 = y_;
      }
      // Probe down and to the right
      for (let x_ = x+1, y_ = y+1; x_ < this.length && y_ < this.length 
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
    var cor;
    for (let x of this.matches_for_index(diag.y0)) {
      cor = Diagonal.fromPointAndLength(x, diag.y0, diag.length);
      if (this.containsDiagonal(cor)) {
        yield cor;
        yield cor.down_main();
      }
    }
    for (let y of this.matches_for_index(diag.x0)) {
      cor = Diagonal.fromPointAndLength(diag.x0, y, diag.length);
      if (this.containsDiagonal(cor)) {
        yield cor;
        yield cor.side_main();
      }
    }
  }
}


/**
 * A chunk of text, presumably some kind of poem/song.
 */
class Verse {
  constructor(text, id) {
    this.raw = text;
    this.id = id;
    this.parse(text);
  }

  get length() {
    return this.clean_words.length;
  }

  static cleanWord(word) {
    var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
    word = word.toLowerCase(); 
    var depuncd = word.replace(punctRE, '');
    // If this word is *all* punctuation, then leave it alone.
    return depuncd || word;
  }

  parse(text) {
    var raw_words = [];
    var clean_words = [];
    var newlines = [];
    var word_ids = new Map();
    var lalas = [];
    var lala_start;
    var last_word;
    var i = 0;
    var lala;
    for (const line of text.split(/\n\r|\r\n|\n|\r/)) {
      for (const word of line.trim().split(/\s+/)) {
        if (!word) {
          continue;
        }
        raw_words.push(word);
        var cleaned = Verse.cleanWord(word);
        clean_words.push(cleaned);
        var count = word_ids.has(cleaned) ? word_ids.get(cleaned)+1 : 1;
        word_ids.set(cleaned, count);

        if (cleaned === last_word) {
          // Should we start a new lala?
          if (lala_start === undefined) {
            lala_start = i - 1;
          }
        } else if (lala_start !== undefined) {
          // The end of a lala
          lala = new Lala(lala_start, i-1, last_word);
          lalas.push(lala);
          lala_start = undefined;
        }
        last_word = cleaned;
        i++;
      }
      newlines.push(clean_words.length - 1);
    }
    // Clean up unresolved lala, if there is one
    if (lala_start) {
      lala = new Lala(lala_start, i-1, last_word);
      lalas.push(lala);
    }
    this.raw_words = raw_words;
    this.clean_words = clean_words;
    this.newline_indices = newlines;
    this.lalas = lalas;
    let RANDOMIZE = false;
    let IGNORE_HAPAX = true;
    var next_idx = 0;
    var nWords = 0;
    for (let [word, count] of word_ids) {
      if (IGNORE_HAPAX && count === 1) {
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
    this.matrix = new VerseMatrix(this.clean_words);
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

  * rects() {
    for (let i=0; i < this.lalas.length; i++) {
      let lala = this.lalas[i];
      for (let j=i; j < this.lalas.length; j++) {
        let lala2 = this.lalas[j];
        if (lala.word !== lala2.word) {
          continue;
        }
        yield {x: lala.start, y: lala2.start, width: lala.length, height: lala2.length};
        if (i !== j) {
          yield {y: lala.start, x: lala2.start, height: lala.length, width: lala2.length};
        }
      }
    }
    for (let pt of this.matrix.adjacency_list) {
     // this feels inefficient. I guess we're trading time for memory.
     var foundx = false, foundy = false;
     for (let lalax of this.lalas) {
      foundx = foundx || lalax.includes(pt.x);
      foundy = foundy || lalax.includes(pt.y);
     }
     if (!foundx || !foundy) {
       yield {x: pt.x, y: pt.y, width: 1, height: 1};
     }
   }
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

  isCustom() {
    console.error("iunno");
  }
  
  isBlank() {
    return this.raw === '';
  }

  diagText(diag) {
    return this.textInRange(diag.x0, diag.x1);
  }

  textInRange(a, b) {
    console.assert(a <= b);
    var res = [];
    if (a > b) {
      return res;
    }
    var acc = '';
    if (!this.newline_indices.includes(a-1)) {
      acc = '... ';
    }
    for (let x=a; 0 <= x && x <= b && x < this.length; x++) {
      acc += this.raw_words[x];
      if (this.newline_indices.includes(x)) {
        res.push(acc);
        acc = '';
      } else {
        acc += ' ';
      }
    }
    if (acc) {
      acc += '...';
      res.push(acc);
    }
    return res;
  }

}

class CannedVerse extends Verse {
  constructor(text, id, title, artist) {
    super(text, id);
    this.title = title;
    this.artist = artist;
    this.clean_title = title ? Verse.cleanWord(title) : "";
    this.title_tokens = title ? this.clean_title.split(" ") : [];
  }

  static fromCanned(c, text) {
    return new CannedVerse(text, c.slug, c.title, c.artist);
  }

  isCustom() {
    return false;
  }

  get slug() {
    // TODO: just rename id to slug
    return this.id;
  }
}

class CustomVerse extends Verse {
  /* Optional firebase key. */
  constructor(text, key) {
    super(text, CUSTOM_SLUG);
    this.key = key;
  }
  isCustom() {
    return true;
  }
  get_permalink(router) {
    if (this.key) {
      // TODO: pretty darn hacky. Surely there's a better way?
      return (window.location.origin 
          + window.location.pathname
          + router.createHref('/custom/' + this.key)
      );
    }
  }
  
  // heh, I made a funny
  static BlankVerse() {
    return new CustomVerse('');
  }

}


export {Verse, VerseMatrix, CannedVerse, CustomVerse};

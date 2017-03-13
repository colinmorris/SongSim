import CANNED_SONGS from './canned-data.js';

// 25 = buddy holly, 27 = callmemaybe
var LANDING_CANNED = CANNED_SONGS[27]; 

class Canned {
  constructor(o) {
    this.slug = o.slug;
    this.artist = o.artist;
    this.title = o.title;
    this.group = o.group;
    this.dropdown = o.dropdown;
    this.hidden = o.hidden;
    this.mini = o.mini;
  }

  get tagline() {
    if (!this.artist) {
      return this.title;
    }
    return `${this.artist} - ${this.title}`;
  }

  get href() {
    return "/" + this.slug;
  }

  static comparator(cana, canb) {
    let textcmp = (t1, t2) => {
        return t1 === t2 ? 0
            : (t1 < t2 ? -1 : 1);
    }
    if (cana.artist && !canb.artist) {
      return 1;
    } else if (canb.artist && !cana.artist) {
      return -1;
    } else if (!cana.artist && !canb.artist) {
      return textcmp(cana.title, canb.title);
    }
    // Both songs have artists
    if (cana.artist === canb.artist) {
      return textcmp(cana.title, canb.title);
    }
    return textcmp(cana.artist, canb.artist)
  }

}

var CANNED = [];
var GROUPED_CANS = new Map();

for (let c of CANNED_SONGS) {
  var can = new Canned(c);
  CANNED.push(can);
  if (!GROUPED_CANS.has(can.group)) {
    GROUPED_CANS.set(can.group, []);
  }
  GROUPED_CANS.get(can.group).push(can);
}
// sort values
let cmp = (a,b) => {
  var keya = a.artist || a.title;
  var keyb = b.artist || b.title;
  return keya < keyb ? -1 : 
    (keyb < keya ? 1 : 0)
};
for (let [k, cans] of GROUPED_CANS) {
  GROUPED_CANS.set(k, cans.sort(cmp));
}
  
export { Canned, GROUPED_CANS, LANDING_CANNED };

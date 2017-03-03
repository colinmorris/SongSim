import CANNED_SONGS from './canned-data.js';

var LANDING_CANNED = CANNED_SONGS[25]; 

class Canned {
  constructor(o) {
    this.slug = o.slug;
    this.artist = o.artist;
    this.title = o.title;
    this.group = o.group;
    this.hidden = o.hidden;
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
}

var CANNED = [];
var GROUPED_CANS = new Map();

for (let c of CANNED_SONGS) {
  var can = new Canned(c);
  CANNED.push(can);
  if (can.hidden) {
    continue;
  }
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

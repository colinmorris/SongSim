
class Diagonal {

  constructor(x0, y0, x1, y1) {
    console.assert(x0 <= x1 && y0 <= y1);
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
  }

  static fromPointAndLength(x, y, len) {
    return new Diagonal(x, y, x+(len-1), y+(len-1));
  }

  get length() {
    return 1 + (this.x1 - this.x0);
  }

  // A uniquely identifying key suitable for hashing/comparison
  get key() {
    return `${this.x0}_${this.y0}_${this.length}`;
  }

  get xrange() {
    return [this.x0, this.x1];
  }

  get yrange() {
    return [this.y0, this.y1];
  }

  isMain() {
    return this.x0 === this.y0;
  }

  contains(x, y) {
    return (this.x0 <= x && x <= this.x1 && (x-y) === (this.x0 - this.y0));
  }

  reflection(about) {
    return new Diagonal(this.y0, this.x0, this.y1, this.x1);
  }

  * points() {
    for (let x = this.x0, y=this.y0; x <= this.x1; x++, y++) {
      yield [x, y];
    }
  }

  /** Return the two main diagonal correlates of this diagonal.
   * (Or nothing, if this is part of the main diagonal)
   */
  mainCorrelates() {
    if (this.isMain()) return [];
    return [
      Diagonal.fromPointAndLength(this.x0, this.x0, this.length),
      Diagonal.fromPointAndLength(this.y0, this.y0, this.length),
    ];
  }

  down_main() {
    return Diagonal.fromPointAndLength(this.x0, this.x0, this.length);
  }
  side_main() {
    return Diagonal.fromPointAndLength(this.y0, this.y0, this.length);
  }


}

export {Diagonal};

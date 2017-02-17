
class Diagonal {

  constructor(x0, y0, x1, y1) {
    console.assert(x0 <= x1 && y0 <= y1);
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
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

  /** Return the two main diagonal correlates of this diagonal.
   * (Or nothing, if this is part of the main diagonal)
   */
  mainCorrelates() {
    var correlates = [];
    if (this.isMain()) return correlates;
    
  }


}

export {Diagonal};

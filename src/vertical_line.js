const Point = require("../src/vector");
"use strict";

// A vertical line
class VerticalLine {
  constructor (x=0, a=0, b=0) {
    this.x = x;
    this.a = b>=a ? a : b;
    this.b = b>=a ? b : a;
  }

  get length () { return this.b - this.a }

  // Point where line crosses
  intersection ( line ) {
    if ( line.a.x > this.x && line.b.x > this.x ) return null; // Right
    if ( line.a.x < this.x && line.b.x < this.x ) return null; // Left

    const cy = line.fy(this.x);
    if ( cy < this.a ) return null; // Below
    if ( cy > this.b ) return null; // Above
    return new Point(this.x, cy);
  }
}

module.exports = VerticalLine;

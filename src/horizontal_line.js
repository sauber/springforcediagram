const Point = require('./vector');
 
"use strict";

// A horizontal line
class HorizontalLine {
  constructor (y=0, a=0, b=0) {
    this.y = y;
    this.a = b>=a ? a : b;
    this.b = b>=a ? b : a;
  }

  // Width
  get length () { return this.b - this.a }

  // Point where line crosses
  intersection ( line ) {
    //console.log('horizontal intersection', this, line);
    if ( line.a.y > this.y && line.b.y > this.y ) return null; // Above
    if ( line.a.y < this.y && line.b.y < this.y ) return null; // Below

    const cx = line.fx(this.y);
    if ( cx < this.a ) return null; // Left
    if ( cx > this.b ) return null; // Right
    //console.log('result', new Point(cx, this.y));
    return new Point(cx, this.y);
  }
  
}

module.exports = HorizontalLine;

// May draw inspiration from
//   https://github.com/alexbol99/flatten-js/blob/master/src/classes/box.js
//   https://dxr.mozilla.org/mozilla-beta/source/toolkit/modules/Geometry.jsm

"use strict";

class Rectangle {
  constructor (width = 0, height = 0) {
    //this.x      = x; // Center x
    //this.y      = y; // Center y
    this._width  = width;
    this._height = height;
  }

  // For rectangle box, it becomes wider or taller
  // Input:
  //   top    = amount top should rise
  //   bottom = amount bottom should sink
  //   left   = amount left should widen
  //   right  = amount right should widen
  adjustSize (top, bottom, left, right) {
    this.width  += left + right;
    this.height += top  + bottom;
    //this.x += (top  - bottom)/2;
    //this.y += (left - right )/2;
  }

  get width () { return this._width }

  set width (value) {
    if (value<0) value=0;
    this._width = value;
  }

  get height () { return this._height }

  set height (value) {
    if (value<0) value=0;
    this._height = value;
  }

  get area () {
    return this._width * this._height;
  }

  /*
  get min_x () { return this.x - this.width /2 }
  get min_y () { return this.y - this.height/2 }
  get max_x () { return this.x + this.width /2 }
  get max_y () { return this.y + this.height/2 }
  */

  get area () { return this.width * this.height }
}

module.exports = Rectangle;

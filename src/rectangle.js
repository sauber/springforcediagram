// May draw inspiration from
//   https://github.com/alexbol99/flatten-js/blob/master/src/classes/box.js
//   https://dxr.mozilla.org/mozilla-beta/source/toolkit/modules/Geometry.jsm

"use strict";

class Rectangle {
  constructor (width = 0, height = 0) {
    this.width  = width;
    this.height = height;
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
}

module.exports = Rectangle;

// May draw inspiration from
//   https://github.com/alexbol99/flatten-js/blob/master/src/classes/box.js

"use strict";

class Rectangle {
  constructor (x = 0, y = 0, w = 0, h = 0) {
    this.x = x;  // Center x
    this.y = y;  // Center y
    this.w = w;  // Width
    this.h = h;  // Height
  }

  area () {
    return this.w * this.h;
  }
}

module.exports = Rectangle;

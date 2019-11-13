// The line between two positions

"use strict";

const Vector = require("./vector");

class Line {
  constructor (p1, p2) { 
    this.a = p1;
    this.b = p2;
  }

  get distance () {
    return new Vector(
      this.b.x - this.a.x,
      this.b.y - this.a.y,
    );
  }
}

module.exports = Line;

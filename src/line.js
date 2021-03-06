// The line between two positions

"use strict";

const Point  = require("./vector");
const Vector = require("./vector");

class Line {
  constructor (p1 = new Point(0,0), p2 = new Point(0,0)) { 
    this.a = p1;
    this.b = p2;
  }

  get distance () {
    return new Vector(
      this.b.x - this.a.x,
      this.b.y - this.a.y,
    );
  }

  get length () {
    return this.distance.magnitude;
  }

  get middle () {
    return new Vector(
      (this.a.x + this.b.x)/2,
      (this.a.y + this.b.y)/2,
    );
  }

  // Slope / gradient
  get m () {
    return (this.b.y-this.a.y)/(this.b.x-this.a.x);
  }

  // At a given x position, what is y
  fy ( x ) {
    return this.a.y+(x-this.a.x)*this.m;
  }

  // At a given y position, what is x
  fx ( y ) {
    return this.a.x+(y-this.a.y)/this.m;
  }
}

// Generate line from numbers instead of point objects
Line.simple = function (ax, ay, bx, by) {
  return new Line( new Point(ax, ay), new Point(bx, by) );
}

module.exports = Line;

"use strict";
const Vector = require("./vector.js");

class Point {
  constructor (position, mass) { 
    this.p = position;         // position
    this.m = mass;             // mass
    this.v = new Vector(0, 0); // velocity
    this.a = new Vector(0, 0); // acceleration
  }

  applyForce (force) {
    this.a = this.a.add(force.divide(this.m));
  }
}

module.exports = Point;

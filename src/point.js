"use strict";

const Physics = require("./physics.js");
const Vector  = require("./vector.js");

class Point {
  constructor (position = new Vector(0,0), mass_callback = function () {
    return 0;
  }) { 
    this.position      = position;
    this.mass_callback = mass_callback;
    this.velocity      = new Vector(0, 0);
    this.acceleration  = new Vector(0, 0);
  }

  get mass () {
    return this.mass_callback()
  }

  applyForce (force) {
    var mass = this.mass;
    if ( mass < Physics.Point.minimalMass ) {
      mass = Physics.Point.minimalMass;
    }
    this.acceleration = this.acceleration.add(force.divide(this.mass));
  }
}

module.exports = Point;

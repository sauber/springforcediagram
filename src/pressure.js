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
    var mass = this.mass_callback()
    if ( mass < Physics.Point.minimalMass ) {
      mass = Physics.Point.minimalMass;
    }
    return mass;
  }

  applyForce (force) {
    this.acceleration = this.acceleration.add(force.divide(this.mass));
  }
}

module.exports = Point;

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
    //console.log(this);
    var mass = this.mass;
    //console.log(mass, force);
    // Avoid massive accelerations of light points (and divide by zero)
    if ( mass < Physics.Point.minimalMass ) {
      mass = Physics.Point.minimalMass;
    }
    //console.log(mass, force);
    this.acceleration = this.acceleration.add(force.divide(this.mass));
  }
}

module.exports = Point;

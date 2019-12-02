"use strict";

const Physics = require("./physics.js");
const Vector  = require("./vector.js");

class Pressure {
  constructor (mass_callback = function () {
    return 0;
  }) { 
    this.mass_callback = mass_callback;
    this.velocity      = new Vector(0, 0);
    this.acceleration  = new Vector(0, 0);
  }

  get mass () {
    var mass = this.mass_callback()
    //console.log("pressure.mass: ", this.mass_callback);
    if ( mass < Physics.Pressure.minimalMass ) {
      mass = Physics.Pressure.minimalMass;
    }
    //console.log("pressure.minimal: ", Physics.Pressure.minimalMass);
    return mass;
  }

  applyForce (force) {
    this.acceleration = this.acceleration.add(force.divide(this.mass));
  }
}

module.exports = Pressure;

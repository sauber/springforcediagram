"use strict";
const Physics = require("./physics.js");
const Vector = require("./vector.js");

class Point {
  constructor (position = new Vector(0,0), mass = Physics.minimalMassWeight ) { 
    this.position     = position;
    this.mass         = mass;
    this.velocity     = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
  }

  applyForce (force) {
    //this.a = this.a.add(force.divide(this.m));
    this.acceleration = this.acceleration.add(force.divide(this.mass));
    //this.a = this.a.add(force);
  }
}

module.exports = Point;

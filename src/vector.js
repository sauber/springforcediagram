// From https://github.com/dhotson/springy/blob/master/springy.js
"use strict";

class Vector {
  constructor ( x = 0, y= 0 ) { 
    this.x = x;
    this.y = y;
  }

  add (v2) {
    return new Vector(this.x + v2.x, this.y + v2.y);
  };

  subtract (v2) {
    return new Vector(this.x - v2.x, this.y - v2.y);
  };

  multiply (n) {
    return new Vector(this.x * n, this.y * n);
  };

  divide (n) {
    return new Vector((this.x / n) || 0, (this.y / n) || 0); // Avoid divide by zero errors..
  };

  get magnitude () {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  };

  normal () {
    return new Vector(-this.y, this.x);
  };

  normalise () {
    return this.divide(this.magnitude);
  };

  equals ( vector ) {
    return (
      this.x == vector.x &&
      this.y == vector.y
    );
  }
}

// Random direction of magnitude 1
Vector.random = function () {
  return new Vector(Math.random(), Math.random()).normalise();
}

module.exports = Vector;

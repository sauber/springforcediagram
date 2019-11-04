"use strict";

class Spring {
  constructor ( point1, point2, type ) {
    this.point1 = point1;  // position
    this.point2 = point2;  // mass
    this.type = type;      // Spring properties
  }

  length () {
    return this.type.length;  // Spring length at rest
  }

  stiffness () {
    return this.type.stiffness;  // How stiff spring is
  }
}

module.exports = Spring;

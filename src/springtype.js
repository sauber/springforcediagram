// Define a spring type to be used multiple times.
// This allows to setup several springs in a system, and globally adjust their properties.

"use strict";

class SpringType {
  constructor ( length, stiffness ) {
    this.length    = length;     // Length at rest
    this.stiffness = stiffness;  // Spring stiffness
  }
}

module.exports = SpringType;

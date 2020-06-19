const Line = require('./line');

"use strict";

class Spring {
  constructor ( line = new Line, length=1, stiffness=1, positive=1 ) {
    this.line = line; // Position a->b
    this.length = length; // Spring length at rest
    this.stiffness = stiffness; // How stiff a spring is
    this.positive = positive; // 0 if spring is negative length
  }

  // When length is less than rest, then tension is high
  // Otherwise lower tension
  get tension () {
    return this.stiffness * ( this.positive
      ? this.length - this.line.length
      : this.length + this.line.length );
  }
}

module.exports = Spring;

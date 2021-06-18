const Spring = require('./spring');

"use strict";

class SpringFactory {
  constructor () {
    this.connector.rest = 2;
    this.connector.stiffness = 0.5;
  }

  // Generate spring for connecting nodes
  connector (line) {
    return new Spring(line, this.connector.rest, this.connector.stiffness);
  }
}

module.exports = SpringFactory;

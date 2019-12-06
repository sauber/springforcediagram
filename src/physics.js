"use strict";

// Variables describing laws of physics

class Physics {
}

// Pressure properties
Physics.Pressure = {
  minimalMass: 0.3
};

// Node properties
Physics.Node = {
  friction: 0.1,
  maxSpeed: 20,
};

// Connector properties
Physics.Spring = {
  length: 3,
  stiffness: 1,
};
module.exports = Physics;

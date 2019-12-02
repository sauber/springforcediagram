"use strict";

const Node      = require("./node.js");
const Connector = require("./connector.js");

class Diagram {
  constructor () { 
    this.nodes = [];
    this.edges = [];
  }

  addNode (label, x, y) {
    var node;
    if ( typeof label === 'string' || label == null ) {
      node = new Node(label, x, y);
    } else {
      node = label;
    }
    //console.log(node);
    this.nodes.push(node);
    return node;
  }

  addEdge (node1, node2) {
    const conn = new Connector(node1, node2);
    this.edges.push(conn);
    return conn;
  }

  step (timestep = 1) {
    // Apply forces
    this.applyForces();
    // Animate nodes
    for ( let node of this.nodes ) {
      node.step(timestep)
    }
  }

  applyForces () {
    this.attractToCenter();
  }

  attractToCenter () {
    for ( let node of this.nodes ) {
      node.center.applyForce(
        node.position.normalise().multiply(-1)
      );
    }
  }

}

module.exports = Diagram;

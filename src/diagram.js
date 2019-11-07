"use strict";

const Node = require("./node.js");
const Edge = require("./edge.js");

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
    const edge = new Edge(node1, node2);
    this.edges.push(edge);
    return edge;
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
        node.center.position.normalise().multiply(-1)
      );
    }
  }

}

module.exports = Diagram;

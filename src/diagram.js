"use strict";
const Node = require("./node.js");

class Diagram {
  constructor () { 
    this.nodes = new Node;
  }

  add (...children) {
    for (let child of children) {
      this.children.push(child);
    }
    return this;
  }
}

module.exports = Diagram;

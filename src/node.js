// May draw inspiration from
//   https://github.com/dagrejs/graphlib/wiki
//   https://codereview.stackexchange.com/questions/226709/javascript-tree-class

"use strict";
const Text      = require("./text");
const Rectangle = require("./rectangle");

class Node {
  constructor (value = undefined, children = []) {
    this.value = value;
    this.shape = new Rectangle();
    this.children = children;
    if ( value ) {
      // Add a text shape as sub node
      const label = new Text(value);
      this.children.unshift(label);
    }
    //console.log(this);
  }

  add (...children) {
    for (let child of children) {
      this.children.push(child);
    }
    return this;
  }

  // Size of node
  area () {
    //console.log(this.shape);
    return this.shape.area();
  }
}

module.exports = Node;

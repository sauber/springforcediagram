// May draw inspiration from
//   https://github.com/dagrejs/graphlib/wiki
//   https://codereview.stackexchange.com/questions/226709/javascript-tree-class

"use strict";
const Text = require("./text");

class Node {
  constructor (value = undefined, children = []) {
    this.value = value;
    this.children = children;
    if ( value ) {
      // Add a text shape as sub node
      const label = new Text(value);
      this.children.unshift(label);
    }
  }

  add (...children) {
    for (let child of children) {
      this.children.push(child);
    }
    return this;
  }
}

module.exports = Node;

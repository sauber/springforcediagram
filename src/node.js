// May draw inspiration from
//   https://github.com/dagrejs/graphlib/wiki
//   https://codereview.stackexchange.com/questions/226709/javascript-tree-class

"use strict";

class Node {
  constructor (value = 0, children = []) {
    this.value = value;
    this.children = children;
  }

  add (...children) {
    for (let child of children) {
      this.children.push(child);
    }
    return this;
  }
}

module.exports = Node;

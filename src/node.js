// May draw inspiration from
//   https://github.com/dagrejs/graphlib/wiki
//   https://codereview.stackexchange.com/questions/226709/javascript-tree-class

"use strict";
const Text      = require("./text");
const Rectangle = require("./rectangle");
const Point     = require("./point");
const Vector    = require("./vector");

class Node {
  constructor (value = undefined, children = []) {
    this.value = value;

    // Value is assumed to be text
    if ( value ) {
      var parent = this;
      this.shape = new Text(function () { return parent.value });
    } else {
      this.shape = new Rectangle();
    }

    this.center = new Point();  // Top center
    this.top    = new Point();  // Top center
    this.bottom = new Point();  // Bottom center
    this.left   = new Point();  // Left center
    this.right  = new Point();  // Right center

    this.children = children;
  }

  add (...children) {
    for (let child of children) {
      this.children.push(new Node(child));
    }
    return this;
  }

  // Size of node
  get size () {
    //console.log(this.shape);
    //return this.shape.area();
    //console.log(new Vector(this.shape.width(), this.shape.height()));
    return new Vector(this.shape.width, this.shape.height);
  }

  get area () {
    //const size = this.size();
    return this.size.x * this.size.y;
  }

  // Run one animation frame
  tick ( timestep ) {
    // Get pressure from all subnodes
    for ( let child of this.children ) {
      //console.log(child);
    }

    /*
       Sequence:
         - pressures have already been translated to accelerations
         - apply accelations to velocities
         - apply accelerations to shape size
         - reset accelerations
         - update position from velocities
         - apply pressure to neighbor objects
         - update kinetic energy
    */
  }

  adjustShapeToPressure (timestep) {
    this.shape.adjustSize(
      timestep,
      this.top.acceleration(),
      this.bottom.acceleration(),
      this.left.acceleration(),
      this.right.acceleration(),
    );
  }

}

module.exports = Node;

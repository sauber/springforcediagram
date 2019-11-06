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

    var node = this;
    var dynamic_mass = function () {
      // There are five points, each weighing 20% of whole body.
      return node.area / 5;
    }
    this.center = new Point(undefined, dynamic_mass);  // Middle
    this.top    = new Point(undefined, dynamic_mass);  // Top center
    this.bottom = new Point(undefined, dynamic_mass);  // Bottom center
    this.left   = new Point(undefined, dynamic_mass);  // Left center
    this.right  = new Point(undefined, dynamic_mass);  // Right center

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

  updateVelocity (timestep) {
    for ( var point of [this.center, this.top, this.bottom, this.left, this.right]) {
      //console.log(point);
      point.velocity = point.velocity.add(point.acceleration.multiply(timestep));
      //console.log(point);
    }
  }

  adjustShapeSizeToBoundaryPressure (timestep) {
    this.shape.adjustSize(
      this.top.acceleration(),
      this.bottom.acceleration(),
      this.left.acceleration(),
      this.right.acceleration(),
    );
  }

}

module.exports = Node;

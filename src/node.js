// May draw inspiration from
//   https://github.com/dagrejs/graphlib/wiki
//   https://codereview.stackexchange.com/questions/226709/javascript-tree-class

"use strict";

const Text      = require("./text");
const Rectangle = require("./rectangle");
const Point     = require("./point");
const Vector    = require("./vector");
const Physics = require("./physics.js");

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

  get boundaries () {
    return [
      this.top,
      this.bottom,
      this.left,
      this.right,
    ];
  }

  get points () {
    return [
      this.top,
      this.bottom,
      this.left,
      this.right,
      this.center,
    ];
  }

  // Run one animation frame
  step ( timestep ) {
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

    this.updateAcceleration(timestep);
    this.updateVelocity(timestep);
    this.updateSize(timestep);
    this.updatePosition(timestep);
  }

  // Disperse pressure on a boundaries to center
  updateAcceleration (timestep) {
    for (const point of this.boundaries) {
      this.center.acceleration = this.center.acceleration.add(point.acceleration).multiply(0.5);
    }
  }

  /*
     If time==0, then inertia = 1
     If time==Inf, then inertia = 0
     If Friction==1, then inertia = 0
     If Friction==0, then inertia = 1
     If Friction==0.5 && time==0.5, then inertia = 0.71
     If Friction==0.5 && time==1, then inertia = 0.5
     If Friction==0.5 && time==2, then inertia = 0.25

      Friction 0.0  0.1  0.5  0.9  1.0
     ---------+------------------------
     Time  0.0|1.00 1.0  1.0  1.0  1.00
           0.1|1.00 0.99 0.93 0.79 0.00
           0.5|1.00 0.95 0.71 0.32 0.00
           0.9|1.00 0.91 0.54 0.13 0.00
           1.0|1.00 0.90 0.50 0.10 0.00
           2.0|1.00 0.81 0.25 0.01 0.00
           4.0|1.00 0.66 0.06 0.00 0.00
          10.0|1.00 0.35 0.00 0.00 0.00

     Formula: inertia = (1-friction)**time
  */

  updateVelocity (timestep) {
    const friction = Physics.Node.friction;
    const inertia = (1-friction) ** timestep;
    // Absorb acceleraion into velocity
    for (const point of this.points) {
      // XXX: Edge and center friction may be different
      point.velocity = point.velocity.add(point.acceleration.multiply(timestep)).multiply(inertia);
      if ( point.velocity.magnitude > Physics.Node.maxSpeed ) {
        point.velocity = point.velocity.normalise().multiply(Physics.Node.maxSpeed);
      }
      point.acceleration = new Vector(0,0);
    }
  }

  updateSize (timestep) {
    this.shape.adjustSize(
      this.top.velocity.y    * timestep,
      this.bottom.velocity.y * timestep,
      this.left.velocity.x   * timestep,
      this.right.velocity.x  * timestep,
    );
  }

  updatePosition (timestep) {
    const center = this.center;
    center.position = center.position.add(center.velocity.multiply(timestep));
  }

  get kineticEnergy () {
    var energy = 0;
    for (const point of this.points) {
      var speed = point.velocity.magnitude;
      var mass = point.mass;
      energy += 0.5 * mass * speed * speed;
    }
    return energy;
  }
}

module.exports = Node;

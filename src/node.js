// May draw inspiration from
//   https://github.com/dagrejs/graphlib/wiki
//   https://codereview.stackexchange.com/questions/226709/javascript-tree-class

"use strict";

const Text      = require("./text");
const Rectangle = require("./rectangle");
const Pressure  = require("./pressure");
const Vector    = require("./vector");
const Physics   = require("./physics");

class Node {
  constructor (label = undefined, x = 0, y = 0, width = 0, height = 0) {
    // Value is assumed to be text
    if ( label ) {
      this.shape = new Text(label);
    } else {
      this.shape = new Rectangle(width, height);
    }

    var node = this;
    var dynamic_mass = function () {
      // There are five points, each weighing 20% of whole body.
      return node.shape.area / 5;
    }
    this.position = new Vector(x, y);
    this.center = new Pressure(dynamic_mass);  // Middle
    this.top    = new Pressure(dynamic_mass);  // Top center
    this.bottom = new Pressure(dynamic_mass);  // Bottom center
    this.left   = new Pressure(dynamic_mass);  // Left center
    this.right  = new Pressure(dynamic_mass);  // Right center

    this.children = [];
  }

  add (...children) {
    for (let child of children) {
      this.children.push(new Node(child));
    }
    return this;
  }

  get min_x () { return this.position.x - this.shape.width /2 }
  get min_y () { return this.position.y - this.shape.height/2 }
  get max_x () { return this.position.x + this.shape.width /2 }
  get max_y () { return this.position.y + this.shape.height/2 }

  // Size of node
  get size () {
    return new Vector(this.shape.width, this.shape.height);
  }

  /*
  get area () {
    return this.size.x * this.size.y;
  }
  */

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

  // Pick a random point on a random vertice of a node
  get randomVerticePoint () {
    const vertice  = Math.random()*4;
    const distance = Math.random();
    const x = this.min_x;
    const y = this.min_x;
    const w = this.shape.width;
    const h = this.shape.height;

    if ( vertice < 1 ) {
      // top
      return new Vector(x+distance*w, y+h);
    } else if ( vertice < 2 ) {
      // bottom
      return new Vector(x+distance*w, y);
    } else if ( vertice < 3 ) {
      // left
      return new Vector(x, y+distance*h);
    } else {
      // right
      return new Vector(x+w, x+distance*h);
    }
  }

  // Apply pressure to a node translates into applying
  // pressure to vertice points.
  applyForce ( vector ) {
    if ( vector.x > 0 )
      this.left.applyForce(   new Vector(vector.x, 0) );
    else
      this.right.applyForce(  new Vector(vector.x, 0) );

    if ( vector.y > 0 )
      this.bottom.applyForce( new Vector(0, vector.y) );
    else
      this.top.applyForce(    new Vector(0, vector.y) );
  }

  // Run one animation frame
  step (timestep = 1) {
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
  updateAcceleration (timestep = 1) {
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
     Time  0.0|1.00 1.00 1.00 1.00 1.00
           0.1|1.00 0.99 0.93 0.79 0.00
           0.5|1.00 0.95 0.71 0.32 0.00
           0.9|1.00 0.91 0.54 0.13 0.00
           1.0|1.00 0.90 0.50 0.10 0.00
           2.0|1.00 0.81 0.25 0.01 0.00
           4.0|1.00 0.66 0.06 0.00 0.00
          10.0|1.00 0.35 0.00 0.00 0.00

     Formula: inertia = (1-friction)**time
  */

  updateVelocity (timestep = 1) {
    const friction = Physics.Node.friction;
    const inertia = (1-friction) ** timestep;
    // Absorb acceleraion into velocity
    // XXX: Move to pressure class
    for (const point of this.points) {
      if ( point.acceleration ) {
        // XXX: Edge and center friction may be different
        //console.log("old velocity:", point.velocity);
        //console.log("old acceleration:", point.acceleration);
        point.velocity = point.velocity.add(point.acceleration.multiply(timestep)).multiply(inertia);
        //console.log("new velocity:", point.velocity);
        //console.log(point.velocity);
        if ( point.velocity.magnitude > Physics.Node.maxSpeed ) {
          point.velocity = point.velocity.normalise().multiply(Physics.Node.maxSpeed);
        }
        //console.log(point.velocity);
        point.acceleration = new Vector(0,0);
      }
    }
  }

  updateSize (timestep = 1) {
    this.shape.adjustSize(
      this.top.velocity.y    * timestep,
      this.bottom.velocity.y * timestep,
      this.left.velocity.x   * timestep,
      this.right.velocity.x  * timestep,
    );
  }

  updatePosition (timestep = 1) {
    this.position = this.position.add(this.center.velocity.multiply(timestep));
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

// Node at random position
Node.random = function (label = undefined, width = 0, height = 0) {
  var node = new Node(label, Math.random()*2-1, Math.random()*2-1, width, height);
  return node;
}

module.exports = Node;

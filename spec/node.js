const Node   = require("../src/node");
const Vector = require("../src/vector");
const Physics = require("../src/physics");

describe("Node", function () {
  it("should allow empty instantiation", function () {
    const node = new Node;

    expect(node.area).toBe(0);
    expect(node.children.length).toBe(0);
    expect(node.center.position.x).toBe(0);
    expect(node.center.position.y).toBe(0);
    expect(node.min_x).toBe(0);
    expect(node.min_y).toBe(0);
    expect(node.max_x).toBe(0);
    expect(node.max_y).toBe(0);
  });

  it("should allow adding child nodes", function () {
    const node = new Node;
    node.add("a");
    expect(node.children.length).toBe(1);
    node.add("b", "c");
    expect(node.children.length).toBe(3);
  });

  it("may be a text node", function () {
    const node = new Node("a cat in the hat");
    expect(node.size).toEqual( new Vector(16,1) );
  });

  it("may have an initial random position", function () {
    const node = new Node.random();
    expect(node.center.position.x).not.toBe(0);
    expect(node.center.position.y).not.toBe(0);
  });

  it("may have an initial size", function () {
    const node = new Node(undefined, undefined, undefined, 4, 2);
    expect(node.area).toBe(8);
    expect(node.min_x).toBe(-2);
    expect(node.min_y).toBe(-1);
    expect(node.max_x).toBe(2);
    expect(node.max_y).toBe(1);
  });

  // Apply force to a boundary edge
  it("should accept pressure", function () {
    // Setup
    const node = new Node("a cat in the hat");

    // Action
    const force = 1;
    node.left.applyForce(new Vector(force,0));

    // Measure
    const acceleration = force / node.left.mass;
    expect(node.left.acceleration.x).toBe(acceleration);
    expect(node.left.acceleration.y).toBe(0);
  });

  it("should update velocity and position from pressure", function () {
    const node = new Node("a cat in the hat");

    // Set acceleration
    const force = 50;
    node.left.applyForce(new Vector(force,0));
    const acceleration = force / node.left.mass;

    // Set velocity
    const timestep = 1;
    node.updateAcceleration(timestep);
    node.updateVelocity(timestep);
    const slipperiness = 1 - Physics.Node.friction;
    const velocity = acceleration * timestep * slipperiness;
    expect(node.left.velocity.x).toBe(velocity);
    expect(node.left.acceleration.y).toBe(0);
    expect(node.kineticEnergy).toBeGreaterThan(300);

    // Update size
    node.updateSize(timestep);
    expect(node.size).toEqual(new Vector(8,2));

    // Update Position
    node.updatePosition(timestep);
    expect(node.center.position.x).toBeGreaterThan(0);
  });

  it("should move and slow after a bump", function () {
    const node = new Node;
    node.bottom.applyForce(new Vector(0,1));
    node.step(1.1);
    expect(node.kineticEnergy).toBeGreaterThan(1);
    let step_count = 0;
    while( node.kineticEnergy > 0.1 ) {
      //console.log(node.kineticEnergy);
      node.step(1.0);
      step_count++;
    }
    //console.log(node.center);
    //console.log(step_count);
    // It takes 14 steps to slow down enough for kinetic energy to be less than 0.1
    expect(step_count).toBe(14);
  });


});

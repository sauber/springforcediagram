const Node   = require("../src/node");
const Vector = require("../src/vector");
const Physics = require("../src/physics");

describe("Node", function () {
  it("should allow empty instantiation", function () {
    const node = new Node;

    expect(node.area).toBe(0);
    expect(node.children.length).toBe(0);
    expect(node.center.position).toEqual( new Vector(0,0) );
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

  it("should have no kinetic energy when at rest", function () {
    const node = new Node;
    node.step(1);
    //console.log(node);
    expect(node.kineticEnergy).toBe(0);
  });


});

const Node = require("../src/node");
const Vector = require("../src/vector");

describe("Node", function () {
  it("should allow empty instantiation", function () {
    const node = new Node;

    expect(node.area()).toBe(0);
    expect(node.children.length).toBe(0);
    expect(node.center.position.x).toBe(0);
    expect(node.center.position.y).toBe(0);

    expect(node.center.position).toEqual( new Vector(0,0) );
  });

  it("could have position", function () {
    const node = new Node;

    expect(node.area()).toBe(0);
    expect(node.children.length).toBe(0);
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
    //expect(textnode.children.length).toBe(1);
    expect(node.area()).toBe(16);
  });

  // Apply force to a point
  it("should accept pressure", function () {
    const node = new Node("a cat in the hat");
    node.left.mass = 1;
    node.left.applyForce(new Vector(1,0));
    expect(node.left.acceleration.x).toBe(1);
    expect(node.left.acceleration.y).toBe(0);
  });
});

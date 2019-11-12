const Edge = require("../src/edge");
const Node = require("../src/node");

describe("Edge", function () {
  it("should allow empty instantiation", function () {
    var edge = new Edge;
    expect(edge).toBeDefined();
  });

  it("should have distance between centers of two nodes", function () {
    const nodea = Node.random();
    const nodeb = Node.random();
    var edge = new Edge(nodea, nodeb);
    expect(edge.centerDistance.x).not.toBe(0);
    expect(edge.centerDistance.y).not.toBe(0);
  });

  it("should have distance between nearest edges of two nodes", function () {
    const nodea = Node.random();
    const nodeb = Node.random();
    var edge = new Edge(nodea, nodeb);
    //console.log(edge.intersectionPoints);
    //expect(edge.centerDistance.x).toBeGreaterThan(0);
    //expect(edge.centerDistance.y).toBeGreaterThan(0);
  });
  
});

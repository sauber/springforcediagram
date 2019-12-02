const Diagram = require("../src/diagram");
const Vector  = require("../src/vector");
const Node    = require("../src/node");

describe("Diagram", function () {
  it("should allow empty instantiation", function () {
    const dia = new Diagram;
    // No initial nodes
    expect(dia.nodes.length).toBe(0);
    // No initial edges
    expect(dia.edges.length).toBe(0);
  });

  it("should allow adding nodes", function () {
    const dia = new Diagram;
    dia.addNode("a");
    expect(dia.nodes.length).toBe(1);
  });

  it("should connect nodes with edges", function () {
    const dia = new Diagram;
    const nodea = dia.addNode("a");
    const nodeb = dia.addNode("b");
    dia.addEdge (nodea, nodeb);
    expect(dia.nodes.length).toBe(2);
    expect(dia.edges.length).toBe(1);
  });

  it("should not attract node at center towards center", function () {
    const dia = new Diagram;
    const node = dia.addNode();
    dia.attractToCenter();
    const v0 = new Vector(0,0);
    expect(node.position).toEqual(v0);
    expect(node.center.velocity).toEqual(v0);
  });

  it("should attract nodes away from center towards center", function () {
    const dia = new Diagram;
    const node = Node.random();
    dia.addNode(node)
    dia.attractToCenter();
    node.step();
    const v0 = new Vector(0,0);
    expect(node.position).not.toEqual(v0);
    expect(node.center.velocity).not.toEqual(v0);
  });

  it("should have expulsion between nearby nodes", function () {
    const dia = new Diagram;
    const nodea = dia.addNode("a");
    const nodeb = dia.addNode("b");
    // TBD
  });
  
  it("can run an animation step", function () {
    const dia = new Diagram;
    //const nodea = dia.addNode(undefined, Math.random(), Math.random());
    //const nodeb = dia.addNode(undefined, Math.random(), Math.random());
    const nodea = dia.addNode();
    const nodeb = dia.addNode();
    dia.addEdge (nodea, nodeb);
    //console.log(dia.nodes.map(x=>x.center));
    dia.step();
    //console.log(dia.nodes.map(x=>x.shape));
    //console.log(dia.nodes.map(x=>x.center));
  });

});

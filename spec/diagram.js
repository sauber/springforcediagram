const Diagram = require("../src/diagram");

describe("Diagram", function () {
  it("should allow empty instantiation", function () {
    var dia = new Diagram;
    // No initial nodes
    expect(dia.nodes.children.length).toBe(0);
    // No initial edges
    expect(dia.edges.children.length).toBe(0);
  });

  it("should allow adding nodes", function () {
    var dia = new Diagram;
    dia.nodes.add("a");
    expect(dia.nodes.children.length).toBe(1);
  });

});

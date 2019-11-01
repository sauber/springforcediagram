var Node = require("../src/node");

describe("Node", function () {
  it("should allow empty instantiation", function () {
    var node = new Node;
  });

  it("should allow adding child nodes", function () {
    var node = new Node;
    node.add("a");
    expect(node.children.length).toBe(1);
    node.add("b", "c");
    expect(node.children.length).toBe(3);
  });

});

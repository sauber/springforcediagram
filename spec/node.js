const Node = require("../src/node");

describe("Node", function () {
  it("should allow empty instantiation", function () {
    const node = new Node;

    expect(node.area).toBe(0);
  });

  it("should allow adding child nodes", function () {
    const node = new Node;
    node.add("a");
    expect(node.children.length).toBe(1);
    node.add("b", "c");
    expect(node.children.length).toBe(3);
  });

  it("may have a text sub node", function () {
    const emptynode = new Node;
    expect(emptynode.children.length).toBe(0);

    const textnode = new Node("label");
    expect(textnode.children.length).toBe(1);
  });

  it("should have an area when having subnode"), function () {
  });
});

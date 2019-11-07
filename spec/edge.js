const Edge = require("../src/edge");

describe("Edge", function () {
  it("should allow empty instantiation", function () {
    var edge = new Edge;
    expect(edge).toBeDefined();
  });
});

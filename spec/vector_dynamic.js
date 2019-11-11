const VectorDynamic = require("../src/vector_dynamic");

describe("VectorDynamic", function () {
  it("should allow empty instantiation", function () {
    const v = new VectorDynamic;
    expect(v.x).toBe(0);
    expect(v.y).toBe(0);
  });

  it("should allow instantiation with value", function () {
    const v = new VectorDynamic(
      function () { return 5 },
      function () { return 2 },
    );
    expect(v.x).toBe(5);
    expect(v.y).toBe(2);
  });
});

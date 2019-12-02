const Point = require("../src/point");

describe("Point", function () {
  it("should instantiate", function () {
    const p = new Point;
  });

  it("uses callback to calculate mass", function () {
    const p = new Point( undefined , function() { return 2 });
    expect(p.mass).toBe(2);
  }); 
});

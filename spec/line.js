const Line   = require("../src/line");
const Vector = require("../src/vector");

describe("Line", function () {
  it("should allow empty instantiation", function () {
    const line = new Line;
    expect(line).toBeDefined();
  });

  it("should have zero distance between two same points", function () {
    const position = new Vector.random();
    const line = new Line(position, position);
    expect(line.distance.magnitude).toBe(0);
  });

  it("should have distance between two different points", function () {
    const line = new Line(new Vector.random(), new Vector.random());
    expect(line.distance.magnitude).toBeGreaterThan(0);
  });

  it("should have a middle point", function () {
    const line = new Line(
      new Vector(1,1),
      new Vector(5,3),
    );
    expect(line.middle).toEqual(new Vector(3,2));
  });
});

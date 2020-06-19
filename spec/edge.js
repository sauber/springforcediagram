const Horizontal = require("../src/horizontal_line");
const Vertical   = require("../src/vertical_line");
const Line       = require("../src/line");
const Point      = require("../src/vector");

describe("Horizontal Edge", function () {
  it("should allow empty instantiation", function () {
    const edge = new Horizontal;
    expect(edge.y).toBe(0);
    expect(edge.a).toBe(0);
    expect(edge.b).toBe(0);
    expect(edge.length).toBe(0);
  });

  it("should have length", function () {
    const edge = new Horizontal(1, 1, 5); // (1,1)->(5,1)
    expect(edge.length).toBe(4);
  });

  it("should find cross point of line", function () {
    const edge = new Horizontal(1, 1, 5); // (1,1)->(5,1)
    const line = new Line(
      new Point(0,0),
      new Point(2,2)
    );
    expect(edge.intersection(line)).toEqual(new Point(1,1));
  });
});

describe("Vertical Edge", function () {
  it("should allow empty instantiation", function () {
    const edge = new Vertical;
    expect(edge.x).toBe(0);
    expect(edge.a).toBe(0);
    expect(edge.b).toBe(0);
    expect(edge.length).toBe(0);
  });

  it("should have length", function () {
    const edge = new Vertical(1, 1, 5); // (1,1)->(1,5)
    expect(edge.length).toBe(4);
  });

  it("should find cross point of line", function () {
    const edge = new Vertical(1, 1, 5); // (1,1)->(5,1)
    const line = new Line(
      new Point(0,0),
      new Point(2,2)
    );
    expect(edge.intersection(line)).toEqual(new Point(1,1));
  });
});

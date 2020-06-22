const Line  = require("../src/line");
const Point = require("../src/vector");

describe("Line", function () {
  var line;
  beforeEach(function(){
    line = new Line( new Point(1,1), new Point(5,3) );
  });

  it("should allow empty instantiation", function () {
    const line = new Line;
    expect(line).toBeDefined();
    expect(line.length).toBe(0);
  });

  it("should have zero distance between two same points", function () {
    const position = new Point.random();
    const line = new Line(position, position);
    expect(line.distance.magnitude).toBe(0);
  });

  it("should have distance between two different points", function () {
    const line = new Line(new Point.random(), new Point.random());
    expect(line.distance.magnitude).toBeGreaterThan(0);
  });

  it("should have a middle point", function () {
    expect(line.middle).toEqual(new Point(3,2));
  });

  it("should have a slope", function () {
    expect(line.m).toEqual(0.5);
  });

  it("should relate x<->y", function () {
    expect(line.fy(3)).toEqual(2);
    expect(line.fx(2)).toEqual(3);
  });

  it("should generator from numers", function () {
    const simple = new Line.simple( 1, 1, 5, 3 ); //(1,1)->(5,3)
    expect(line).toEqual(line);
  });
});

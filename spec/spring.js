//const SpringType = require("../src/springtype");
//const Pressure   = require("../src/pressure");
const Line   = require("../src/line");
const Point  = require("../src/vector");
const Spring = require("../src/spring");

describe("Spring", function () {
  //const length = 1;
  //const stiffness = 0.5;
  //const point1 = new Pressure(0, 0);
  //const point2 = new Pressure(1, 0);
  //const type = new SpringType(length, stiffness);
  //const line = new Line(
    //new Point(0,0),
    //new Point(2,0),
  //);

  it("should allow empty instantiation", function () {
    const s = new Spring();
    expect(s).toBeDefined();
    expect(s.tension).toBe(1);
  });

  it("should allow negative length", function () {
    const line = new Line(
      new Point(0,0),
      new Point(2,0),
    );
    const s = new Spring(line);
    s.positive = 0;
    expect(s.tension).toBe(3);
  });
});

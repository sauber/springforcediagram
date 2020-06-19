const Line   = require("../src/line");
const Point  = require("../src/vector");
const Spring = require("../src/spring");

describe("Spring", function () {

  var line;
  beforeEach(function(){
    line = new Line( new Point(0,0), new Point(2,0) );
  });

  it("should allow empty instantiation", function () {
    const s = new Spring();
    expect(s).toBeDefined();
    expect(s.tension).toBe(1);
  });

  it("should allow negative length", function () {
    const s = new Spring(line);
    s.positive = 0;
    expect(s.tension).toBe(3);
  });

  it("should have more tension when shorter", function () {
    const s = new Spring(line);
    const t = new Spring(new Line(new Point(0,0), new Point(1,0)));
    expect(t.tension).toBeGreaterThan(s.tension);
  });

  it("should have less tension when longer", function () {
    const s = new Spring(line);
    const t = new Spring(new Line(new Point(0,0), new Point(3,0)));
    expect(t.tension).toBeLessThan(s.tension);
  });

  it("should have more tension when stiffer", function () {
    const short = new Line(new Point(0,0), new Point(0.5,0))
    const s = new Spring(short);
    const t = new Spring(short);
    t.stiffness = 2;
    expect(t.tension).toBeGreaterThan(s.tension);
  });

});

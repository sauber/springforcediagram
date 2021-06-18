const Line   = require("../src/line");
const Point  = require("../src/vector");
const Spring = require("../src/spring");
const SpringFactory = require("../src/spring_factory");

describe("SpringFactory", function () {

  var line;
  beforeEach(function(){
    line = new Line( new Point(0,0), new Point(2,0) );
  });

  it("should allow empty instantiation", function () {
    const f = new SpringFactory();
    expect(f).toBeDefined();
  });

  it("should generator connector springs", function () {
    const f = new SpringFactory();
    const s = f.connector(line);
    expect(s).toEqual(jasmine.any(Spring));
  });

});

const SpringType = require("../src/springtype");
const Pressure   = require("../src/pressure");
const Spring     = require("../src/spring");

describe("Spring", function () {
  const length = 1;
  const stiffness = 0.5;
  const point1 = new Pressure(0, 0);
  const point2 = new Pressure(1, 0);
  const type = new SpringType(length, stiffness);

  it("should instantiate", function () {
    const s = new Spring(point1, point2, type);
    expect(s).toBeDefined();
    expect(s.length()).toBe(length);
    expect(s.stiffness()).toBe(stiffness);
  });
});

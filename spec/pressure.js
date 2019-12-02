const Pressure = require("../src/pressure");

describe("Pressure", function () {
  it("should instantiate", function () {
    const p = new Pressure;
  });

  it("uses callback to calculate mass", function () {
    const p = new Pressure( function() { return 2 });
    expect(p.mass).toBe(2);
  }); 
});

const Rectangle = require("../src/rectangle");

describe("Rectangle", function () {
  it("should allow empty instantiation", function () {
    var box = new Rectangle;
    expect(box.width ).toBe(0);
    expect(box.height).toBe(0);
  });
});

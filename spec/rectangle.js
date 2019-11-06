const Rectangle = require("../src/rectangle");

describe("Rectangle", function () {
  it("should allow empty instantiation", function () {
    var box = new Rectangle;
    expect(box.width ).toBe(0);
    expect(box.height).toBe(0);
  });

  it("should allow resizing", function () {
    const cases = [
      [  0,  0,  0,  0, 2, 2 ],  // No resize
      [  1,  0,  0,  0, 2, 3 ],  // Pull top
      [  0,  1,  0,  0, 2, 3 ],  // Pull bottom
      [  0,  0,  1,  0, 3, 2 ],  // Pull left
      [  0,  0,  0,  1, 3, 2 ],  // Pull right
      [ -1,  0,  0,  0, 2, 1 ],  // Push top
      [  0, -1,  0,  0, 2, 1 ],  // Push bottom
      [  0,  0, -1,  0, 1, 2 ],  // Push left
      [  0,  0,  0, -1, 1, 2 ],  // Push right
    ];

    for ( let values of cases ) {
      const rect = new Rectangle(2, 2);
      let [width, height] = values.splice(4, 2);
      rect.adjustSize(...values);
      expect(rect.width ).toBe(width );
      expect(rect.height).toBe(height);
    }
  });
  
});

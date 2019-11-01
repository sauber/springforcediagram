const Text = require("../src/text");

describe("Text", function () {
  it("should allow empty instantiation", function () {
    var text = new Text;
    //console.log(text.words());
    expect(text.words.length).toBe(0);
    expect(text.lines().length).toBe(1);
    expect(text.area()).toBe(0);
  });

  it("should have size when having value", function () {
    var text = new Text("a");
    expect(text.area()).toBe(1*1);

    text.value = "a b";
    expect(text.area()).toBe(1*3);
  });
});

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

    text.value = "a bcd";
    expect(text.area()).toBe(1*5);

    text.taller();
    expect(text.area()).toBe(2*3);
    expect(text.desired_line_count).toBe(2);

    text.taller();
    expect(text.area()).toBe(2*3);
    expect(text.desired_line_count).toBe(2);
  });
});

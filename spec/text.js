const Text = require("../src/text");

describe("Text", function () {
  it("should allow empty instantiation", function () {
    const text = new Text;
    //console.log(text.words());
    expect(text.words.length).toBe(0);
    expect(text.lines().length).toBe(1);
    expect(text.area()).toBe(0);
  });

  it("should have size when having value", function () {
    const text = new Text("a");
    expect(text.area()).toBe(1*1);
  });

  it("should allow chaning line count", function () {
    const text = new Text("a bcd");
    expect(text.area()).toBe(1*5);

    text.taller();
    expect(text.area()).toBe(2*3);
    expect(text.desired_line_count).toBe(2);

    text.taller();
    expect(text.area()).toBe(2*3);
    expect(text.desired_line_count).toBe(2);

    text.flatter();
    expect(text.area()).toBe(1*5);
    expect(text.desired_line_count).toBe(1);
  });

  it("should render large texts in various sizes", function () {
    const text = new Text("the quick red fox jumped over the lazy dog");

    const shapes = [
      1, [
        "the quick red fox jumped over the lazy dog"
      ],
      2, [
        "the quick red fox jumped",
        "over the lazy dog"
      ],
      3, [
        "the quick red",
        "fox jumped over",
        "the lazy dog"
      ],
      4, [
        "the quick",
        "red fox",
        "jumped over",
        "the lazy dog"
      ],
      5, [
        "the quick",
        "red fox",
        "jumped",
        "over the",
        "lazy dog"
      ],
      6, [
        "the",
        "quick",
        "red fox",
        "jumped",
        "over the",
        "lazy dog"
      ],
      7, [
        "the",
        "quick",
        "red fox",
        "jumped",
        "over the",
        "lazy dog"
      ],
      8, [
        "the",
        "quick",
        "red fox",
        "jumped",
        "over",
        "the",
        "lazy",
        "dog"
      ],
      9, [
        "the",
        "quick",
        "red",
        "fox",
        "jumped",
        "over",
        "the",
        "lazy",
        "dog"
      ]
    ];

    var count;
    var lines;
    while ( shapes.length >=2 ) {
      [count, lines] = shapes.splice(0, 2);
      //console.log(count);
      //console.log(lines);
      text.desired_line_count = count;
      expect(text.lines()).toEqual(lines);
      expect(text.desired_line_count).toBe(count);
 
    }
  });
});

const Text = require("../src/text");

describe("Text", function () {
  it("should allow empty instantiation", function () {
    const text = new Text;
    //console.log(text.words());
    expect(text.words.length).toBe(0);
    expect(text.lines().length).toBe(1);
    expect(text.width() ).toBe(0);
    expect(text.height()).toBe(1);
  });

  it("should have size when having value", function () {
    const text = new Text(function(){return "a"});
    //expect(text.area()).toBe(1*1);
    expect(text.width() ).toBe(1);
    expect(text.height()).toBe(1);
  });

  it("should allow chaning line count", function () {
    const text = new Text(function(){return "a bcd"});
    //expect(text.area()).toBe(1*5);
    expect(text.width() ).toBe(5);
    expect(text.height()).toBe(1);

    text.taller();
    //expect(text.area()).toBe(2*3);
    expect(text.desired_line_count).toBe(2);
    expect(text.width() ).toBe(3);
    expect(text.height()).toBe(2);

    text.taller();
    //expect(text.area()).toBe(2*3);
    expect(text.desired_line_count).toBe(2);
    expect(text.width() ).toBe(3);
    expect(text.height()).toBe(2);

    text.flatter();
    //expect(text.area()).toBe(1*5);
    expect(text.desired_line_count).toBe(1);
    expect(text.width() ).toBe(5);
    expect(text.height()).toBe(1);
  });

  it("should render large texts in various sizes", function () {
    const text = new Text(function(){return "the quick red fox jumped over the lazy dog"});

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
      text.desired_line_count = count;
      expect(text.lines()).toEqual(lines);
      expect(text.desired_line_count).toBe(count);
      expect(text.height()).toBeLessThanOrEqual(text.desired_line_count);
      expect(text.width()).toBe(Math.max(...(lines.map(x => x.length))));
    }
  });
});
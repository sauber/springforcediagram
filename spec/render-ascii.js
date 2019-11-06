const Render = require("../src/render-ascii");

describe("Render", function () {
  it("should instantiate", function () {
    const r = new Render;
  });

  it("should accept plotting nothing", function () {
    const r = new Render;
    r.plotChar(0,0,"");
    expect(r.grid).toEqual({});
  });

  it("should accept plotting chars", function () {
    const r = new Render;
    r.plotChar(0,0,"a");
    expect(r.grid).toEqual({0:{0:'a'}});
  });

  it("should accept plotting strings", function () {
    const r = new Render;
    r.plotString(0,0,"abc");
    expect(r.grid).toEqual({0:{0:'a'},1:{0:'b'},2:{0:'c'}});
    //console.log(r);
    //console.log(r.lines);
  });

  it("should plot boxes", function () {
    const r = new Render;
    r.plotRectangle(0, 0, 3, 2);
    //r.lines.map(x => console.log(x));
    expect(r.lines).toEqual(['+--+', '|  |', '+--+' ]);
  });

  it("should plot lines", function () {
    const r = new Render;
    r.plotLine(-1, -1, 2, 1);
    //console.log(r.lines);
    //r.lines.map(x => console.log(x));
    expect(r.lines).toEqual([ 'oo  ', '  o ', '   o' ]);
  });
});

const Render  = require("../src/render-ascii");
const Diagram = require("../src/diagram");

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
  });

  it("should plot boxes", function () {
    const r = new Render;
    r.plotRectangle(0, 0, 3, 2);
    expect(r.lines).toEqual([
      '+--+',
      '|  |',
      '+--+',
    ]);
  });

  it("should plot lines", function () {
    const r = new Render;
    r.plotLine(-1, -1, 2, 1);
    expect(r.lines).toEqual([ 
      '   o',
      ' oo ',
      'o   ',
    ]);

    /*
    // Draw 10 random lines
    for ( var i = 0; i<10; i++ ) {
      var l = new Render;
      var coor = [10,10,10,10].map(c => Math.random()*c - c/2);
      l.plotLine(...coor);
      l.lines.map(x => console.log('|' + x + '|'));
    }
    */
  });

  it("should plot text block", function () {
    const r = new Render;
    r.plotText(0, 0, ['a cat','in the','hat']);
    expect(r.lines).toEqual([
      'a cat ',
      'in the',
      ' hat  ',
    ]);

    /*
    // Draw text 10 times at random coordinates
    for ( var i = 0; i<10; i++ ) {
      var l = new Render;
      var coor = [10,10].map(c => Math.random()*c - c/2);
      l.plotText(...coor, ['a cat','in','the hat']);
      l.framed.lines.map(x => console.log(x));
    }
    */
  });

  it("may draw a frame", function () {
    const r = new Render;
    r.plotChar(0,0,'x');
    expect(r.framed.lines).toEqual([
     ',-.',
     '|x|',
     "`-'",
    ]);
  });

  it("may render a whole graph", function () {
    const dia = new Diagram;
    const a = dia.addNode("a");
    const b = dia.addNode("b");
    const c = dia.addNode("c");
    const d = dia.addNode();
    const e = dia.addEdge(a, b);
    const f = dia.addEdge(b, c);
    const g = dia.addEdge(c, a);

    var r;
    for ( var i = 0; i<4; i++ ) {
      dia.step();
      r = new Render;
      r.plotDiagram(dia);
      console.log(r.lines);
      console.log(e.node0.center.velocity);
    }

    console.log(a.position);
    console.log(b.position);
    console.log(e.intersections);
  });
});

const Connector = require("../src/connector");
const Node      = require("../src/node");
const Vector    = require("../src/vector");
const Line      = require("../src/line");

describe("Connector", function () {
  it("should not allow empty instantiation", function () {
    var conn;
    try { conn = new Connector } catch {};
    expect(conn).not.toBeDefined();
  });

  it("should have distance between centers of two nodes at random locations", function () {
    const a = Node.random();
    const b = Node.random();
    const c = new Connector(a, b);
    expect(c.centers.length).toBeGreaterThan(0);
    // Edge to edge connector is same as centers
    const s = c.spring;
    expect(s.line).toEqual(c.centers);
  });

  it("should have distance between nearest edges of two nodes at identical position", function () {
    // Node centers exactly on top of each other
    // +-----+
    // |     |
    // |  *  |
    // |     |
    // +-----+

    const a = new Node;
    const b = new Node;
    const c = new Connector(a, b);
    expect(c.centers.distance.magnitude).toBe(0);
    // There is no overlap when size is 0
    expect(c.isOverlap).toBeFalse();
    const s = c.spring;
    const zeroline = Line.simple(0,0,0,0);
    expect(s.line).toEqual(zeroline);
  });

  it("should have distance between edges when having an area and identical position", function () {
    const a = new Node(undefined, 0, 0, 4, 4);
    const b = new Node(undefined, 0, 0, 4, 4);
    const c = new Connector(a, b);
    expect(c.isOverlap).toBeTrue();
    const s = c.spring;
    const l = s.line;
    expect(
      l.a.x == -2 ||
      l.a.y == -2 ||
      l.a.x ==  2 ||
      l.a.y ==  2
    ).toBeTrue();
    expect(
      l.b.x == -2 ||
      l.b.y == -2 ||
      l.b.x ==  2 ||
      l.b.y ==  2
    ).toBeTrue();
  });

  it("should have distance when both centers are within edges of both nodes", function () {
    //  Both centers are within edges of both nodes

    //  5+-------+
    //   | +-------+
    //  3| | a   : |
    //  2| |   b : |
    //   +-|~~~~~' |
    //  0  +-------+
    //   0   2 3   5

    //  Test cases at the following positions
    //  b c d * *   a = (2  ,3)
    //  *       *   b = (1  ,4) => i = (4,1)->(-1,6)
    //  *   a   *   c = (1.5,4) => i = (3,1)->( 0,6)
    //  *       *   d = (2  ,4)
    //  * * * * *   ...

    const cases = [
      // bx, by, aix, aiy, bix, biy
      [ 1  , 4  , 0, 5, 3  , 2   ],  // top left
      [ 1.5, 4  , 1, 5, 2.5, 2   ],  // top slight left
      [ 2  , 4  , 2, 5, 2  , 2   ],  // top
      [ 2.5, 4  , 3, 5, 1.5, 2   ],  // top slight right
      [ 3  , 4  , 4, 5, 1  , 2   ],  // top right

      [ 3  , 3.5, 4, 4, 1  , 2.5 ],  // slight top right
      [ 3  , 3  , 4, 3, 1  , 3   ],  // right
      [ 3  , 2.5, 4, 2, 1  , 3.5 ],  // slight bottom right

      [ 3  , 2  , 4, 1, 1  , 4   ],  // bottom right
      [ 2.5, 2  , 3, 1, 1.5, 4   ],  // bottom slight right
      [ 2  , 2  , 2, 1, 2  , 4   ],  // bottom
      [ 1.5, 2  , 1, 1, 2.5, 4   ],  // bottom slight left
      [ 1  , 2  , 0, 1, 3  , 4   ],  // bottom left

      [ 1  , 2.5, 0, 2, 3  , 3.5 ],  // slight bottom left
      [ 1  , 3,   0, 3, 3  , 3   ],  // left
      [ 1  , 3.5, 0, 4, 3  , 2.5 ],  // slight top left
    ];

    for ( let test of cases ) {
      const a = new Node(undefined, 2, 3, 4, 4);
      //console.log(a.min_x, a.min_y, a.max_x, a.max_y);
      const b = new Node(undefined, test[0], test[1], 4, 4);
      //console.log(b.min_x, b.min_y, b.max_x, b.max_y);
      const c = new Connector(a, b);
      const i = c.spring.line;
      console.log( test, i );
      expect(i).toBeDefined();
      const line = new Line.simple(test[2], test[3], test[4], test[5]);
      //expect(i.a.x).toBe(test[2]);
      //expect(i.a.y).toBe(test[3]);
      //expect(i.b.x).toBe(test[4]);
      //expect(i.b.y).toBe(test[5]);
      expect(i).toEqual(line);
      expect(c.isOverlap).toBeTrue();
      //throw(1);
    }
  });

  it("should have distance when centers are on edges", function () {
    // Centers are located exactly on edges
    // 5+-------+
    // 4|   +-------+
    // 3|   a   :   |
    // 2|   |   b   |
    // 1+---|~~~'   |
    // 0    +-------+
    //  0   2   4   6

    var nodea = new Node(undefined, 2, 3, 4, 4);
    var nodeb = new Node(undefined, 4, 2, 4, 4);
    var conn = new Connector(nodea, nodeb);
    var ee = conn.intersections;
    expect(ee.a.x).toBe(4);
    expect(ee.a.y).toBe(2);
    expect(ee.b.x).toBe(2);
    expect(ee.b.y).toBe(3);
    expect(conn.isOverlap).toBeTrue();
    // XXX magnitude is negative
  });

  it("should have distance when nodes overlap", function () {
    // Both centers are outside edges and edges overlap
    // 6+-------+
    //  |       |
    // 4|   a +-------+
    //  |     | :     |
    // 2+-----|~' b   |
    //        |       |
    // 0      +-------+
    //  0   2 3 4 5    7

    var nodea = new Node(undefined, 2, 4, 4, 4);
    var nodeb = new Node(undefined, 5, 2, 4, 4);
    var conn = new Connector(nodea, nodeb);
    var ee = conn.intersections;
    // Edge to Edge line is (4,2.67) -> (3,3.33)
    expect(ee.a.x).toBeCloseTo(4.00, 2);
    expect(ee.a.y).toBeCloseTo(2.67, 2);
    expect(ee.b.x).toBeCloseTo(3.00, 2);
    expect(ee.b.y).toBeCloseTo(3.33, 2);
    // XXX Need to indicate that line is inside nodes, ie. the  distance is negative
    expect(conn.isOverlap).toBeTrue();
    // XXX magnitude is negative
  });

  it("should have distance when edges overlap", function () {
    // When edges touch, intersection points overlap
    // 6+-------+
    //  |       |
    // 4|   a   +-------+
    //  |       *       |
    // 2+-------|   b   |
    // 1        |       |
    // 0        +-------+
    //  0   2   4   6   8

    var nodea = new Node(undefined, 2, 4, 4, 4);
    var nodeb = new Node(undefined, 6, 2, 4, 4);
    var conn = new Connector(nodea, nodeb);
    var ee = conn.intersections;
    expect(ee.a).toEqual(ee.b);
    expect(ee.b).toEqual(ee.a);
    expect(conn.isOverlap).not.toBeTrue();
    // XXX magnitude is zero
  });

  it("should have distance when nodes have distance", function () {
    // No overlap of edges
    // 6+-------+
    //  |       |
    // 4|   a   | +-------+
    //  |       |\|       |
    // 2+-------+ |   b   |
    // 1          |       |
    // 0          +-------+
    //  0   2   4 5   7   9
 
    var nodea = new Node(undefined, 2, 4, 4, 4);
    var nodeb = new Node(undefined, 7, 2, 4, 4);
    var conn = new Connector(nodea, nodeb);
    var ee = conn.intersections;
    expect(ee.a.x).toBeCloseTo(4.00, 2);
    expect(ee.a.y).toBeCloseTo(3.20, 2);
    expect(ee.b.x).toBeCloseTo(5.00, 2);
    expect(ee.b.y).toBeCloseTo(2.80, 2);
    expect(conn.isOverlap).not.toBeTrue();
  });

  it("should have distance when far apart", function () {
    const a = new Node('a', -16.790159949671647, 5.571926205174964);
    const b = new Node('b', -27.141822812006268, 7.106986312982537);
    const c = new Connector(a, b);
    const i = c.intersections;
    console.log(a.position);
    console.log(b.position);
    console.log(i);
    console.log(a.shape.width, a.shape.height);
    expect(i.a.x).toBe(a.position.x);
  });

  it("should apply force to two nodes", function () {
    const a = new Node('a');
    const b = new Node('b');
    const c = new Connector(a, b);
    c.step();

    console.log("a", {
      center: a.center.acceleration,
    });

    console.log("b", {
      center: b.center.acceleration,
    });

    a.step();
    b.step();

    console.log("a", {
      center: a.center.velocity,
      top:    a.top.velocity,
      bottom: a.bottom.velocity,
      left:   a.left.velocity,
      right:  a.right.velocity,
    });

    console.log("b", {
      center: b.center.velocity,
      top:    b.top.velocity,
      bottom: b.bottom.velocity,
      left:   b.left.velocity,
      right:  b.right.velocity,
    });

    //console.log("connector", c);
    //console.log("connector", c.node0.left);

    // Nodes move in opposite direction
    console.log("node a position", a.position);
    console.log("node b position", b.position);
    expect(a.position.x).toBe(-b.position.x);
    expect(a.position.y).toBe(-b.position.y);
  });

  it("should apply force to two nodes", function () {
    const a = new Node('a');
    const b = new Node('b');
    const c = new Connector(a, b);

    const v = c.horizontalCross(
       1,-1,
      -1, 1,
       3,
      -10,
       10,
    );
    console.log(v);
    //console.log(c.intersections);
  });
});

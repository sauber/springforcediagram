const Connector = require("../src/connector");
const Node      = require("../src/node");
const Vector    = require("../src/vector");

describe("Connector", function () {
  it("should allow empty instantiation", function () {
    const conn = new Connector;
    expect(conn).toBeDefined();
  });

  it("should have distance between centers of two nodes at random locations", function () {
    const nodea = Node.random();
    const nodeb = Node.random();
    const conn = new Connector(nodea, nodeb);
    expect(conn.centers.distance.magnitude).toBeGreaterThan(0);
  });

  it("should have distance between nearest edges of two nodes at identical position", function () {
    /*
      Node centers exactly on top of each other
      +-----+
      |     |
      |  *  |
      |     |
      +-----+
    */
    var nodea = new Node;
    var nodeb = new Node;
    var conn = new Connector(nodea, nodeb);
    expect(conn.centers.distance.magnitude).toBe(0);
    // There is no overlap when size is 0
    expect(conn.isOverlap).toBeFalse();
    // XXX: Test edge intersections
  });

  it("should have distance when both centers are within edges of both nodes", function () {
    /*
      Both centers are within edges of both nodes

      5+-------+
       | +-------+
      3| | a   : |
      2| |   b : |
       +-|~~~~~' |
      0  +-------+
       0   2 3   5
    */

    /*
      Test cases at the following positions
      b c d * *   a = (2  ,3)
      *       *   b = (1  ,4) => i = (4,1)->(-1,6)
      *   a   *   c = (1.5,4) => i = (3,1)->( 0,6)
      *       *   d = (2  ,4)
      * * * * *   ...
    */

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
      const b = new Node(undefined, test[0], test[1], 4, 4);
      const c = new Connector(a, b);
      const i = c.projectedIntersection;
      //console.log( test, i );
      expect(i).toBeDefined();
      expect(i.a.x).toBe(test[2]);
      expect(i.a.y).toBe(test[3]);
      expect(c.isOverlap).toBeTrue();
    }

    /*
    var nodea = new Node(undefined, 2, 3, 4, 4);
    var nodeb = new Node(undefined, 3, 2, 4, 4);
    var conn = new Connector(nodea, nodeb);
    //var ee = conn.intersections;
    //console.log(ee);
    //console.log(conn.centers);
    //console.log(conn.intersections);
    // XXX Need expect cases
    console.log("Centers near", conn.isOverlap);
    expect(conn.isOverlap).toBeTrue();
    // Must be (4,1)
    console.log( conn.projectedIntersection );

    var nodea = new Node(undefined, 2, 3, 4, 4);
    var nodeb = new Node(undefined, 1, 2, 4, 4);
    var conn = new Connector(nodea, nodeb);
    console.log( conn.projectedIntersection );

    var nodea = new Node(undefined, 2, 3, 4, 4);
    var nodeb = new Node(undefined, 2, 4, 4, 4);
    var conn = new Connector(nodea, nodeb);
    console.log( conn.projectedIntersection );
    // XXX magnitude is negative
    */
  });

  it("should have distance when centers are on edges", function () {
    // Centers are located exactly on edges
    /*
      5+-------+
      4|   +-------+
      3|   a   :   |
      2|   |   b   |
      1+---|~~~'   |
      0    +-------+
       0   2   4   6
    */
    var nodea = new Node(undefined, 2, 3, 4, 4);
    var nodeb = new Node(undefined, 4, 2, 4, 4);
    var conn = new Connector(nodea, nodeb);
    var ee = conn.intersections;
    //console.log(ee);
    expect(ee.a.x).toBe(4);
    expect(ee.a.y).toBe(2);
    expect(ee.b.x).toBe(2);
    expect(ee.b.y).toBe(3);
    expect(conn.isOverlap).toBeTrue();
    // XXX magnitude is negative
  });

  it("should have distance when nodes overlap", function () {
    /*
      Both centers are outside edges and edges overlap
      6+-------+
       |       |
      4|   a +-------+
       |     | :     |
      2+-----|~' b   |
             |       |
      0      +-------+
       0   2 3 4 5    7
    */
    var nodea = new Node(undefined, 2, 4, 4, 4);
    var nodeb = new Node(undefined, 5, 2, 4, 4);
    var conn = new Connector(nodea, nodeb);
    var ee = conn.intersections;
    //console.log(conn.centers);
    //console.log(conn.intersections);
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
    /*
      When edges touch, intersection points overlap
      6+-------+
       |       |
      4|   a   +-------+
       |       *       |
      2+-------|   b   |
      1        |       |
      0        +-------+
       0   2   4   6   8
    */
    var nodea = new Node(undefined, 2, 4, 4, 4);
    var nodeb = new Node(undefined, 6, 2, 4, 4);
    var conn = new Connector(nodea, nodeb);
    var ee = conn.intersections;
    //console.log(ee);
    expect(ee.a).toEqual(ee.b);
    expect(conn.isOverlap).not.toBeTrue();
    // XXX magnitude is zero
  });

  it("should have distance when nodes have distance", function () {
    /*
      No overlap of edges
      6+-------+
       |       |
      4|   a   | +-------+
       |       | |       |
      2+-------+ |   b   |
      1          |       |
      0          +-------+
       0   2   4 5   7   9
    */
    var nodea = new Node(undefined, 2, 4, 4, 4);
    var nodeb = new Node(undefined, 7, 2, 4, 4);
    var conn = new Connector(nodea, nodeb);
    var ee = conn.intersections;
    //console.log(conn.centers);
    //console.log(conn.intersections);
    //console.log(conn.intersections.distance);
    //expect(conn.intersections.distance).toEqual(new Vector(1,-0.4));
    //console.log(conn.intersections.distance.magnitude);
    // Edge to Edge line is (4.0,3.2) -> (5.0,2.8)
    expect(ee.a.x).toBeCloseTo(4.00, 2);
    expect(ee.a.y).toBeCloseTo(3.20, 2);
    expect(ee.b.x).toBeCloseTo(5.00, 2);
    expect(ee.b.y).toBeCloseTo(2.80, 2);
    expect(conn.isOverlap).not.toBeTrue();

    //const nodea = Node.random(undefined, 1, 1);
    //const nodeb = Node.random(undefined, 1, 1);
    //var conn = new Connector(nodea, nodeb);
    //console.log(conn.intersectionPoints);
    //expect(conn.centerDistance.x).toBeGreaterThan(0);
    //expect(conn.centerDistance.y).toBeGreaterThan(0);
    // XXX magnitude is positive
  });
  
});

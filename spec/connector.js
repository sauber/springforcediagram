const Connector = require("../src/connector");
const Node      = require("../src/node");
const Vector    = require("../src/vector");

describe("Connector", function () {
  it("should allow empty instantiation", function () {
    const conn = new Connector;
    expect(conn).toBeDefined();
  });

  it("should have distance between centers of two nodes", function () {
    const nodea = Node.random();
    const nodeb = Node.random();
    const conn = new Connector(nodea, nodeb);
    expect(conn.centers.distance.magnitude).toBeGreaterThan(0);
  });

  it("should have distance between nearest edges of two nodes", function () {
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

    /*
      Both centers are with edges of both nodes

      5+-------+
       | +-------+
      3| | a   : |
      2| |   b : |
       +-|~~~~~' |
      0  +-------+
       0   2 3   5
    */
    var nodea = new Node(undefined, 2, 3, 4, 4);
    var nodeb = new Node(undefined, 3, 2, 4, 4);
    var conn = new Connector(nodea, nodeb);
    var ee = conn.intersections;
    //console.log(ee);
    //console.log(conn.centers);
    //console.log(conn.intersections);
    // XXX Need expect cases

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

    //const nodea = Node.random(undefined, 1, 1);
    //const nodeb = Node.random(undefined, 1, 1);
    //var conn = new Connector(nodea, nodeb);
    //console.log(conn.intersectionPoints);
    //expect(conn.centerDistance.x).toBeGreaterThan(0);
    //expect(conn.centerDistance.y).toBeGreaterThan(0);
  });
  
});

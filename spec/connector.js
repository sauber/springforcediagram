const Connector = require("../src/connector");
const Node      = require("../src/node");

describe("Connector", function () {
  it("should allow empty instantiation", function () {
    var conn = new Connector;
    expect(conn).toBeDefined();
  });

  it("should have distance between centers of two nodes", function () {
    const nodea = Node.random();
    const nodeb = Node.random();
    var conn = new Connector(nodea, nodeb);
    expect(conn.centerDistance.x).not.toBe(0);
    expect(conn.centerDistance.y).not.toBe(0);
  });

  it("should have distance between nearest conns of two nodes", function () {
    const nodea = Node.random();
    const nodeb = Node.random();
    var conn = new Connector(nodea, nodeb);
    //console.log(conn.intersectionPoints);
    //expect(conn.centerDistance.x).toBeGreaterThan(0);
    //expect(conn.centerDistance.y).toBeGreaterThan(0);
  });
  
});

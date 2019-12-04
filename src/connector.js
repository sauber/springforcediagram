"use strict";

const Vector    = require("./vector");
const Line      = require("./line");
const Rectangle = require("./rectangle");

class Connector {
  constructor (node0, node1) { 
    this.node0 = node0;
    this.node1 = node1;
  }

  // A line from center to center
  get centers () {
    return new Line(this.node1.position, this.node0.position);
  }

  LSegsIntersectionPoint (ps1, pe1, ps2, pe2) {
    // Get A,B of first line - points : ps1 to pe1
    var A1 = pe1.y-ps1.y;
    var B1 = ps1.x-pe1.x;
    // Get A,B of second line - points : ps2 to pe2
    var A2 = pe2.y-ps2.y;
    var B2 = ps2.x-pe2.x;

    // Get delta and check if the lines are parallel
    var delta = A1*B2 - A2*B1;
    //console.log(delta, ps1, pe2,  ps2, pe2);
    if(delta == 0) return null;

    // Get C of first and second lines
    var C2 = A2*ps2.x+B2*ps2.y;
    var C1 = A1*ps1.x+B1*ps1.y;
    //invert delta to make division cheaper
    var invdelta = 1/delta;
    // now return the Vector intersection point
    return new Vector( (B2*C1 - B1*C2)*invdelta, (A1*C2 - A2*C1)*invdelta );
  }

  LSegRec_IntersPoint_v02(p1, p2, min_x, min_y, max_x, max_y) {
    var intersection;
    //console.log(p1, p2, min_x, min_y, max_x, max_y);

    if (p2.x <= min_x) //If the second point of the segment is at left/bottom-left/top-left of the AABB
    {
      if (p2.y >= min_y && p2.y <= max_y) { return this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, min_y), new Vector(min_x, max_y)); } //If it is at the left
      else if (p2.y <= min_y) //If it is at the bottom-left
      {
        intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, min_y), new Vector(max_x, min_y));
        if (intersection == null) intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, min_y), new Vector(min_x, max_y));
        //console.log("Bottom left");
        //console.log(intersection);
        return intersection;
      }
      else //if p2.y > max_y, i.e. if it is at the top-left
      {
        intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, max_y), new Vector(max_x, max_y));
        if (intersection == null) intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, min_y), new Vector(min_x, max_y));
        //console.log("Top left");
        //console.log(intersection);
        return intersection;
      }
    }

    else if (p2.x >= max_x) //If the second point of the segment is at right/bottom-right/top-right of the AABB
    {
      if (p2.y >= min_y && p2.y <= max_y) { return this.LSegsIntersectionPoint(p1, p2, new Vector(max_x, min_y), new Vector(max_x, max_y)); } //If it is at the right
      else if (p2.y <= min_y) //If it is at the bottom-right
      {
        intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, min_y), new Vector(max_x, min_y));
        if (intersection == null) intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(max_x, min_y), new Vector(max_x, max_y));
        //console.log("Bottom right");
        //console.log(intersection);
        return intersection;
      }
      else //if p2.y > max_y, i.e. if it is at the top-left
      {
        intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, max_y), new Vector(max_x, max_y));
        if (intersection == null) intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(max_x, min_y), new Vector(max_x, max_y));
        //console.log("Top right");
        //console.log(intersection);
        return intersection;
      }
    }

    else //If the second point of the segment is at top/bottom of the AABB
    {
      //console.log("Somewhere else");
      if (p2.y <= min_y) return this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, min_y), new Vector(max_x, min_y)); //If it is at the bottom
      if (p2.y >= max_y) return this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, max_y), new Vector(max_x, max_y)); //If it is at the top
    }

    //console.log("Nowhere");
    return null;
  }

  get isOverlap () {
    const r1 = this.node0;
    const r2 = this.node1;

    return (
      r1.min_x < r2.max_x &&
      r2.min_x < r1.max_x &&
      r1.min_y < r2.max_y &&
      r2.min_y < r1.max_y
    );
  }

  // The line connecting intersections
  get intersections () {
    /*
    console.log(
        this.node0.position,
        this.node1.position,
        this.node0.min_x,
        this.node0.min_y,
        this.node0.max_x,
        this.node0.max_y,
    );
    console.log(
        this.node0.position,
        this.node1.position,
        this.node1.min_x,
        this.node1.min_y,
        this.node1.max_x,
        this.node1.max_y,
    );
    */

    var node0_intersection;
    if ( this.node0.area == 0 ) {
      node0_intersection = this.node0.position;
    } else {
      node0_intersection = this.LSegRec_IntersPoint_v02(
        this.node0.position,
        this.node1.position,
        this.node0.min_x,
        this.node0.min_y,
        this.node0.max_x,
        this.node0.max_y,
      );
    }

    var node1_intersection;
    if ( this.node1.area == 0 ) {
      node1_intersection = this.node1.position;
    } else {
      node1_intersection = this.LSegRec_IntersPoint_v02(
        this.node1.position,
        this.node0.position,
        this.node1.min_x,
        this.node1.min_y,
        this.node1.max_x,
        this.node1.max_y,
      );
    }

    return new Line(node0_intersection, node1_intersection);
  }


  /*
    When both center points are inside rectangles, then 
    line between centers need to be projected until reaching
    a vertice. The magnitude is negative.

      5+-------+
       |+-o-----+
      3||  \   :|
      2||   \  :|
       +|~~~~o~'|
      0 +-------+
       0   2 3   5
  */
  get projectedIntersection () {
    return new Line(
      this.projectedBack(this.node0, this.node1),
      this.projectedBack(this.node1, this.node0),
    );
  }

  projectedBack ( r1, r2 ) {
    const ax = r1.position.x;
    const ay = r1.position.y;
    const bx = r2.position.x;
    const by = r2.position.y;
    //const r1 = this.node0;
    //const r2 = this.node1;

    if ( r1.position.equals(r2.position) ) {
      throw("Node centers are on top of each other");
    }

    // Try above
    if ( by > ay ) {
      //console.log("Trying above");
      const hy = by - ay;       // Y distance from r1 to r2
      const fy = r1.max_y - ay; // Y distance to top of r1
      const hx = bx - ax;       // X distance from r1 to r2
      const fx = ax + hx / hy * fy;
      if ( fx >= r1.min_x && fx <= r1.max_x ) {
        //console.log(hy, fy, hx, fx);
        return new Vector(fx, r1.max_y);
      }
    }

    // Try below
    if ( by < ay ) {
      //console.log("Trying below");
      const hy = ay - by;       // Y distance from r1 to r2
      const fy = ay - r1.min_y; // Y distance to bottom of r1
      const hx = bx - ax;       // X distance from r1 to r2
      const fx = ax + hx / hy * fy;
      if ( fx >= r1.min_x && fx <= r1.max_x ) {
        //console.log(hy, fy, hx, fx);
        return new Vector(fx, r1.min_y);
      }
    }

    // Try to the left
    if ( bx < ax ) {
      //console.log("Trying left");
      const hx = ax - bx;       // X distance from r1 to r2
      const fx = ax - r1.min_x; // X distance to left of r1
      const hy = by - ay;       // Y distance from r1 to r2
      const fy = ay + hy / hx * fx;
      if ( fy >= r1.min_y && fy <= r1.max_y ) {
        //console.log(hy, fy, hx, fx);
        return new Vector(r1.min_x, fy);
      }
    }

    // Try to the right
    if ( bx > ax ) {
      //console.log("Trying right");
      const hx = bx - ax;       // X distance from r1 to r2
      const fx = r1.max_x - ax; // X distance to right of r1
      const hy = by - ay;       // Y distance from r1 to r2
      const fy = ay + hy / hx * fx;
      if ( fy >= r1.min_y && fy <= r1.max_y ) {
        //console.log(hy, fy, hx, fx);
        return new Vector(r1.max_x, fy);
      }
    }

  }

}

module.exports = Connector;

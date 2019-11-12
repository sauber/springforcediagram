"use strict";

const Vector = require("../src/vector");

class Connector {
  constructor (node0, node1) { 
    this.node0 = node0;
    this.node1 = node1;
  }

  get centerDistance () {
    return new Vector(
      this.node1.center.position.x - this.node0.center.position.x,
      this.node1.center.position.y - this.node0.center.position.y,
    );
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
    var intersction;

    if (p2.x < min_x) //If the second point of the segment is at left/bottom-left/top-left of the AABB
    {
      if (p2.y > min_y && p2.y < max_y) { return this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, min_y), new Vector(min_x, max_y)); } //If it is at the left
      else if (p2.y < min_y) //If it is at the bottom-left
      {
        intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, min_y), new Vector(max_x, min_y));
        if (intersection == null) intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, min_y), new Vector(min_x, max_y));
        return intersection;
      }
      else //if p2.y > max_y, i.e. if it is at the top-left
      {
        intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, max_y), new Vector(max_x, max_y));
        if (intersection == null) intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, min_y), new Vector(min_x, max_y));
        return intersection;
      }
    }

    else if (p2.x > max_x) //If the second point of the segment is at right/bottom-right/top-right of the AABB
    {
      if (p2.y > min_y && p2.y < max_y) { return this.LSegsIntersectionPoint(p1, p2, new Vector(max_x, min_y), new Vector(max_x, max_y)); } //If it is at the right
      else if (p2.y < min_y) //If it is at the bottom-right
      {
        intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, min_y), new Vector(max_x, min_y));
        if (intersection == null) intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(max_x, min_y), new Vector(max_x, max_y));
        return intersection;
      }
      else //if p2.y > max_y, i.e. if it is at the top-left
      {
        intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, max_y), new Vector(max_x, max_y));
        if (intersection == null) intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(max_x, min_y), new Vector(max_x, max_y));
        return intersection;
      }
    }

    else //If the second point of the segment is at top/bottom of the AABB
    {
      if (p2.y < min_y) return this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, min_y), new Vector(max_x, min_y)); //If it is at the bottom
      if (p2.y > max_y) return this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, max_y), new Vector(max_x, max_y)); //If it is at the top
    }

    return null;
  }

  get intersectionPoints () {
    return [
      this.LSegRec_IntersPoint_v02(
        this.node0.center.position,
        this.node1.center.position,
        this.node0.left.x,
        this.node0.bottom.y,
        this.node0.right.x,
        this.node0.top.y,
      ),
      this.LSegRec_IntersPoint_v02(
        this.node0.center.position,
        this.node1.center.position,
        this.node1.left.x,
        this.node1.bottom.y,
        this.node1.right.x,
        this.node1.top.y,
      ),
    ];
  }

}

module.exports = Connector;

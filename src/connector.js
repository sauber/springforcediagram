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

  // The new rectangle that is intersection of two original rectangles
  get overlap () {
    //int x = Math.Max(a.X, b.X);
    const x = Math.max(this.node0.min_x, this.node1.min_x);
    //int num1 = Math.Min(a.X + a.Width, b.X + b.Width);
    const num1 = Math.min(this.node0.max_x, this.node1.max_x);
    //int y = Math.Max(a.Y, b.Y);
    const y = Math.max(this.node0.min_y, this.node1.min_y);
    //int num2 = Math.Min(a.Y + a.Height, b.Y + b.Height);
    const num2 = Math.min(this.node0.max_y, this.node1.max_y);
    if (num1 >= x && num2 >= y)
      //return new Rectangle(x, y, num1 - x, num2 - y);
      return new Rectangle(num1 - 2*x, num2 - 2*y);
    else
      // There is no overlap
      return null;
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

    if ( this.overlap ) {
      //console.log("There is overlap of nodes" + this.overlap);
    }

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

}

module.exports = Connector;

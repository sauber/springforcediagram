"use strict";

const Point     = require("./vector");
const Vector    = require("./vector");
const Line      = require("./line");
const Rectangle = require("./rectangle");
//const Physics   = require("./physics");
const Springs   = require("./spring_factory");

class Connector {
  constructor (node0, node1) { 
    if ( ! node0 || ! node1 )
      throw("Two nodes required for connector");

    this.node0   = node0;
    this.node1   = node1;
    this.springs = new Springs;
  }

  // A line from center to center
  get centers () {
    return new Line(this.node0.position, this.node1.position);
  }

  /*
  LSegsIntersectionPoint (ps1, pe1, ps2, pe2) {
    // Get A,B of first line - points : ps1 to pe1
    var A1 = pe1.y-ps1.y;
    var B1 = ps1.x-pe1.x;
    // Get A,B of second line - points : ps2 to pe2
    var A2 = pe2.y-ps2.y;
    var B2 = ps2.x-pe2.x;

    // Get delta and check if the lines are parallel
    var delta = A1*B2 - A2*B1;
    console.log("delta ps1 pe1 ps2 pe2", delta, ps1, pe2,  ps2, pe2);
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
    console.log("parameters:", p1, p2, min_x, min_y, max_x, max_y);

    if (p2.x <= min_x) //If the second point of the segment is at left/bottom-left/top-left of the AABB
    {
      if (p2.y >= min_y && p2.y <= max_y) { return this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, min_y), new Vector(min_x, max_y)); } //If it is at the left
      else if (p2.y <= min_y) //If it is at the bottom-left
      {
        intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, min_y), new Vector(max_x, min_y));
        if (intersection == null) intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, min_y), new Vector(min_x, max_y));
        console.log("Bottom left intersection", intersection);
        return intersection;
      }
      else //if p2.y > max_y, i.e. if it is at the top-left
      {
        intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, max_y), new Vector(max_x, max_y));
        if (intersection == null) intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, min_y), new Vector(min_x, max_y));
        console.log("Top left intersection", intersection);
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
        console.log("Bottom right intersection", intersection);
        return intersection;
      }
      else //if p2.y > max_y, i.e. if it is at the top-left
      {
        intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, max_y), new Vector(max_x, max_y));
        if (intersection == null) intersection = this.LSegsIntersectionPoint(p1, p2, new Vector(max_x, min_y), new Vector(max_x, max_y));
        console.log("Top right intersection", intersection);
        return intersection;
      }
    }

    else //If the second point of the segment is at top/bottom of the AABB
    {
      console.log("Somewhere else");
      if (p2.y <= min_y) return this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, min_y), new Vector(max_x, min_y)); //If it is at the bottom
      if (p2.y >= max_y) return this.LSegsIntersectionPoint(p1, p2, new Vector(min_x, max_y), new Vector(max_x, max_y)); //If it is at the top
    }

    console.log("Nowhere");
    return null;
  }

  // The line connecting intersections
  get intersections () {
    const r1 = this.node0;
    const r2 = this.node1;

    // Apply jitter if positions are equal
    const jitter =
      r1.position.equals(r2.position)
      ? function () { return Math.random()*0.2-1 }
      : function () { return 0 };

    const upon = r1.position.equals(r2.position);

    var node0_intersection;
    if ( r1.shape.area == 0 ) {
      console.log("n0 zero area");
      node0_intersection = r1.position;
    } else if ( upon ) {
      console.log("n0 same position");
      node0_intersection = r1.randomVerticePoint;
    } else if ( this.isOverlap ) {
      console.log("n0 part overlap");
      node0_intersection = this.projectedBack( r1, r2)
    } else {
      console.log("n0 vertice point");
      console.log("min/max:", r1.min_x, r1.min_y, r1.max_x, r1.max_y);
      node0_intersection = this.LSegRec_IntersPoint_v02(
        r1.position,
        r2.position,
        r1.min_x,
        r1.min_y,
        r1.max_x,
        r1.max_y,
      );
    }

    var node1_intersection;
    if ( r2.shape.area == 0 ) {
      console.log("n1 zero area");
      node1_intersection = r2.position;
    } else if ( upon ) {
      console.log("n1 same position");
      node1_intersection = r2.randomVerticePoint;
    } else if ( this.isOverlap ) {
      console.log("n1 part overlap");
      node1_intersection = this.projectedBack( r2, r1)
    } else {
      console.log("n1 vertice point");
      console.log("min/max:", r2.min_x, r2.min_y, r2.max_x, r2.max_y);
      node1_intersection = this.LSegRec_IntersPoint_v02(
        r2.position,
        r1.position,
        r2.min_x,
        r2.min_y,
        r2.max_x,
        r2.max_y,
      );
    }

    return new Line(node0_intersection, node1_intersection);
  }
  */

  // Do the nodes have overlap?
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

  // The spring connection node edges
  //  +-------+
  //  |       |
  //  |   a   | +-------+
  //  |       |\|       |
  //  +-------+ |   b   |
  //            |       |
  //            +-------+
  get spring () {
    const r1 = this.node0;
    const r2 = this.node1;

    // Are centers on top of each other
    const upon = r1.position.equals(r2.position);

    const p1 = [r1.position.x, r1.position.y, r2.position.x, r2.position.y]; // From middle of r1 to middle of r2
    const p2 = [r2.position.x, r2.position.y, r1.position.x, r1.position.y]; // From middle of r2 to middle of r1

    var r1_is;
    if ( r1.shape.area == 0 ) {
      //console.log("r1 is zero area");
      r1_is = r1.position;
    } else if ( upon ) {
      //console.log("r1 is same position");
      r1_is = r1.randomVerticePoint;
    } else {
      //console.log("r1 is distance from r2");
      //console.log(...p1, r1.min_x, r1.min_y, r2.min_x, r2.min_y);
      r1_is =
        this.horizontalCross(...p1, r1.max_y, r1.min_x, r2.max_x) || // top
        this.horizontalCross(...p1, r1.min_y, r1.min_x, r2.max_x) || // bottom
        this.verticalCross(...p1, r1.min_x, r1.min_y, r2.max_y) || // left
        this.verticalCross(...p1, r1.max_x, r1.min_y, r2.max_y); // right
    }
    //console.log(r1_is);
    if ( ! r1_is ) throw ('r1 has no connector point');

    var r2_is;
    if ( r2.shape.area == 0 ) {
      //console.log("r2 is zero area");
      r2_is = r2.position;
    } else if ( upon ) {
      //console.log("r2 is same position");
      r2_is = r2.randomVerticePoint;
    } else {
      //console.log("r2 is distance from r1");
      //console.log(r1.min_x, r1.min_y, r2.min_x, r2.min_y);
      r2_is =
        this.horizontalCross(...p2, r2.max_y, r2.min_x, r1.max_x) || // top
        this.horizontalCross(...p2, r2.min_y, r2.min_x, r1.max_x) || // bottom
        this.verticalCross(...p2, r2.min_x, r2.min_y, r1.max_y) || // left
        this.verticalCross(...p2, r2.max_x, r2.min_y, r1.max_y); // right
    }
    //console.log(r2_is);
    if ( ! r2_is ) throw ('r2 has no connector point');

    return this.springs.connector(new Line(r1_is, r2_is));
  }

  get spring_new () {
    const n1 = this.node0;
    const n2 = this.node1;
    var p1, p2;

    // Nodes have centers at same position
    const upon = n1.position.equals(n2.position);

    if ( n1.shape.area == 0 ) {
      //console.log('node1 is zero area');
      p1 = n1.position;
    } else if ( upon ) {
      //console.log('node1 has same center as node2');
      p1 = n1.randomVerticePoint;
    } else {
      // cycle through each side of the node to find where center-to-center line crosses
      // break when found
      const sides = n1.sides;
      for ( let side of sides ) {
        const p = side.intersection(this.centers);
        if ( p ) {
          p1 = p;
          break;
        }
      }
    }
    if ( ! p1 ) throw ('node1 has no connector point');

    if ( n2.shape.area == 0 ) {
      //console.log('node2 is zero area');
      p2 = n2.position;
    } else if ( upon ) {
      //console.log('node2 has same center as node1');
      p2 = n2.randomVerticePoint;
    } else {
      // cycle through each side of the node to find where center-to-center line crosses
      // break when found
      const sides = n2.sides;
      for ( let side of sides ) {
        const p = side.intersection(this.centers);
        if ( p ) {
          p2 = p;
          break;
        }
      }
    }
    if ( ! p2 ) throw ('node1 has no connector point');

    return this.springs.connector(new Line(p1, p2));
  }

  // A line is crossing a horizontal line
  // (or vertical if swapping x<->y)
  //
  //                r2
  //               /
  // (x_min,y) o--*--o (x_max,y)
  //             /
  //            r1
  //
  horizontalCross ( r1x, r1y, r2x, r2y, ly, x_min, x_max) {
    //if ( ! r1x || ! r1y || ! r2x || ! r2y || ! ly || ! x_min || ! x_max ) throw(`horizontalCross missing input: r1x=${r1x} r1y=${r1y} r2x=${r2x} r2y=${r2y} ly=${ly}, x_min=${x_min}, x_max=${x_max}`);
    const  x = r2x - r1x; // x from r1 to r2
    const  y = r2y - r1y; // y from r1 to r2
    const dy =   ly - r1y; // y from r1 to line
    const dx = x * (dy/y);  // x from r1 to cross
    const cx = r1x + dx;   // x of point
    //if ( ! cx ) throw(`cx is undefined: x=${x} y=${y} dy=${dy} dx=${dx} r1x=${r1x} r2x=${r2x}`);
    const cy = ly;          // y of point
    //if ( r1y > ly && r2y > ly ) return null; // Above
    //if ( r1y < ly && r2y < ly ) return null; // Below
    if ( cx < x_min || cx > x_max ) return null; // Not crossing
    if ( r2x > r1x && cx < r1x ) return null; // Crossing left of r1
    if ( r1x > r2x && cx > r1x ) return null; // Crossing right of r1
    //console.log(`horizontalCross at cx=${cx}, cy=${cy}`);
    return new Vector(cx, cy);                   // Crossing between r1/r2 or beyond r2
  }

  // A line is crossing a vertical line
  //
  // (x,y_max)
  //  r1 o
  //    \|
  //     *
  //     |\
  //     o r2
  // (x,y_min)
  //
  verticalCross ( r1x, r1y, r2x, r2y, lx, y_min, y_max) {
    return this.horizontalCross(r1y, r1x, r2y, r2x, lx, y_min, y_max);
  }



  /*
    When both center points are inside rectangles, then 
    line between centers need to be projected until reaching
    a vertice. The magnitude is negative.
    XXX: This may not be the case for both rectangles!

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

  // Both point of a line are located inside of a rectangle.
  // When extending from r1 through r2, which one of the vertices
  // will the line cut through,
  // and at what point on the vertice?
  //
  projectedBack ( r1, r2 ) {
    // Apply jitter if positions are equal
    const jitter =
      r1.position.equals(r2.position)
      ? function () { return Math.random()*0.2-1 }
      : function () { return 0 };

    const ax = r1.position.x + jitter();
    const ay = r1.position.y + jitter();
    const bx = r2.position.x + jitter();
    const by = r2.position.y + jitter();

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
    throw("Gotta have an edge");
  }

  // Apply pressure to nodes based on connector length
  step () {
    // Apply pressure to each node to reach ideal distance
    const intersection = this.intersections; // Line between edges
    const overlap = this.overlap ? 1 : -1; // Negative distance
    const currentLength = overlap * intersection.distance.magnitude;
    const restLength = Physics.Spring.length; // Ideal length
    // When current length is less than ideal,
    // the spring is too short, and generate positive pressure.
    const tension = (restLength - currentLength) * Physics.Spring.stiffness; 
    // Half tension is applied to each node
    const b_force = new Vector(
      intersection.b.x - intersection.a.x,
      intersection.b.y - intersection.a.y,
    ).normalise().multiply(tension).multiply(0.5);
    const a_force = b_force.multiply(-1);
    this.node0.applyForce(a_force);
    this.node1.applyForce(b_force);
    /*
    console.log("vars", {
     'intersect': intersection,
     'overlap': overlap,
     'currentdistance': currentLength,
     'restdistance': restLength,
     'tension': tension,
     'a_force': a_force,
     'b_force': b_force,
    });
    console.log("connector", this);
    */
  }

}

module.exports = Connector;

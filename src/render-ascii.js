"use strict";

// Variables describing laws of physics

class Render {
  constructor () {
    this.grid = {};
    this.minx = undefined;
    this.maxx = undefined;
    this.miny = undefined;
    this.maxy = undefined;
    this.is_framed = undefined;
  }

  get framed () {
    this.is_framed = 1;
    return this;
  }

  plotChar (x, y, char) {
    if ( ! char ) { return };
    x = Math.floor(x);
    y = Math.floor(y);
    if ( this.minx == null ) {
      this.minx = x;
      this.maxx = x;
      this.miny = y;
      this.maxy = y;
    } else {
      if ( x < this.minx ) { this.minx = x }
      if ( x > this.maxx ) { this.maxx = x }
      if ( y < this.miny ) { this.miny = y }
      if ( y > this.maxy ) { this.maxy = y }
    }
    if ( ! this.grid[x] ) { this.grid[x] = {} }
    this.grid[x][y] = char;
  }

  plotString (x, y, string) {
    for (const char of string) {
      this.plotChar(x++, y, char)
    }
  }

  plotRectangle ( midx, midy, width, height ) {
    const minx = midx - (width /2);
    const maxx = midx + (width /2);
    const miny = midy - (height/2);
    const maxy = midy + (height/2);
    for ( var x = minx + 1 ; x < maxx ; x++ ) {
      this.plotChar(x, miny, '-');
      this.plotChar(x, maxy, '-');
    }
    for ( var y = miny + 1 ; y < maxy ; y++ ) {
      this.plotChar(minx, y, '|');
      this.plotChar(maxx, y, '|');
    }
    this.plotChar(minx, miny, '+');
    this.plotChar(maxx, miny, '+');
    this.plotChar(minx, maxy, '+');
    this.plotChar(maxx, maxy, '+');
  }

  plotLine(x0, y0, x1, y1) {
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;

    var safety = 25;
    while(true) {
      console.log(x0,y0,x1,y1,dx,dy,sx,sy,err,Math.abs(x0 - x1),Math.abs(y0 - y1));
      console.log(Math.abs(x0 - x1) < 1 && Math.abs(y0 - y1) < 1);
      this.plotChar(x0, y0, 'o');
      if (Math.abs(x0 - x1) < 1 && Math.abs(y0 - y1) < 1) break;
      var e2 = 2*err;
      if (e2 > -dy) { err -= dy; x0  += sx; }
      if (e2 < dx) { err += dx; y0  += sy; }
      if ( --safety <= 0 ) throw("runaway");
    }
  }

  // Plot lines of text
  plotText(midx, midy, lines) {
    var y = midy + (lines.length-1)/2;
    for ( const line of lines ) {
      this.plotString(midx - line.length/2, y--, line);
    }
  }

  // Render grid of chars into lines of text, topmost first
  get lines () {
    const lines = [];
    if (this.is_framed) {
      // Bottom line
      var line = '`';
      for ( var x = this.minx ; x <= this.maxx ; x++ ) {
        line += '-';
      }
      line += "'";
      lines.unshift(line);
    }
    for ( var y = this.miny ; y <= this.maxy ; y++ ) {
      var line = '';
      for ( var x = this.minx ; x <= this.maxx ; x++ ) {
        if ( this.grid[x] && this.grid[x][y] ) {
          line += this.grid[x][y];
        } else {
          line += ' ';
        }
      }
      if (this.is_framed) line = '|' + line + '|';
      lines.unshift(line);
    }
    if (this.is_framed) {
      // Top line
      var line = ',';
      for ( var x = this.minx ; x <= this.maxx ; x++ ) {
        line += '-';
      }
      line += ".";
      lines.unshift(line);
    }
    return lines;
  }

  // Plot nodes in a diagram
  //
  plotDiagram(diagram) {
    // Render Nodes
    console.log('Render Nodes');
    for ( const node of diagram.nodes ) {
      const nodetype = node.shape.constructor.name;
      if ( nodetype == 'Text' ) {
        this.plotText(
          node.position.x,
          node.position.y,
          node.shape.lines,
        );
      } else {
        this.plotRectangle(
          node.position.x,
          node.position.y,
          node.shape.width,
          node.shape.height,
        );
      }
    }

    // Render Edges
    //console.log('Render Edges');
    for ( const edge of diagram.edges ) {
      const i = edge.intersections;
      // TODO
      //this.plotLine(i.a.x, i.a.y, i.b.x, i.b.y);
    }
    //console.log('Render Done');
  }
}

module.exports = Render;

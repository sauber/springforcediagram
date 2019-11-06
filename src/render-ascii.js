"use strict";

// Variables describing laws of physics

class Render {
  constructor () {
    this.grid = {};
    this.minx = 0;
    this.maxx = 0;
    this.miny = 0;
    this.maxy = 0;
  }

  plotChar (x, y, char) {
    x = Math.floor(x);
    y = Math.floor(y);
    if ( ! char ) { return };
    if ( x < this.minx ) { this.minx = x }
    if ( x > this.maxx ) { this.maxx = x }
    if ( y < this.miny ) { this.miny = y }
    if ( y > this.maxy ) { this.maxy = y }
    if ( ! this.grid[x] ) { this.grid[x] = {} }
    this.grid[x][y] = char;
  }

  plotString (x, y, string) {
    for ( var i = 0; i <= string.length; i++ ) {
      this.plotChar(x+i, y, string.charAt(i));
    }
  }

  plotRectangle ( midx, midy, width, height ) {
    const minx = midx - width /2);
    const maxx = midx + width /2);
    const miny = midy - height/2);
    const maxy = midy + height/2);
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

  plotLine ( minx, miny, maxx, maxy ) {
    //minx = Math.floor(minx);
    //maxx = Math.floor(maxx);
    //miny = Math.floor(miny);
    //maxy = Math.floor(maxy);
    if ( (maxx-minx) > (maxy-miny) ) {
      // Line is longer than it's tall
      const dely = (maxy-miny) / (maxx-minx);
      for ( var x = minx; x <= maxx; x ++ ) {
        var y = miny + dely*(x-minx);
        this.plotChar(x, y, 'o');
      }
    }
  }

  get lines () {
    const lines = [];
    for ( var y = this.miny ; y <= this.maxy ; y++ ) {
      var line = '';
      for ( var x = this.minx ; x <= this.maxx ; x++ ) {
        if ( this.grid[x] && this.grid[x][y] ) {
          line += this.grid[x][y];
        } else {
          line += ' ';
        }
      }
      lines.push(line);
    }
    return lines;
  }
}

module.exports = Render;

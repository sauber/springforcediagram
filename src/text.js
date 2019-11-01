"use strict";

class Text {
  constructor (value = '', x = 0, y = 0, desired_line_count = 1, font_size = 1) {
    this.value = value;  // Text string
    this.x = x;  // Center x
    this.y = y;  // Center y
    this.desired_line_count = desired_line_count;  // Number of desired lines in rendered output
    this.font_size = font_size;  // Size of font
  }

  words () {
    return this.value.split(/\s+/);
  }

  // Join words into lines
  lines () {
    return [ this.words().join(' ') ];
  }
  
  area () {
    var lines = this.lines().map(x => x.length);
    //console.log(lines);
    return lines.length * Math.max(...lines);
  }
}

module.exports = Text;

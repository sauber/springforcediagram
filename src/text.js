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

  // Join words into lines, trying to match desired number of lines
  lines () {
    var words = this.words();
    if ( this.desired_line_count == 1 ) {
      return [ words.join(' ') ];
    }

    var width;
    var lines;
    var index;
    // console.log(this.min_width());
    // console.log(this.max_width());
    const min = this.min_width();
    const max = this.max_width();
    for ( width = min; width <= max; width++ ) {
      // console.log(width);
      lines = [''];
      for ( index = 0; index < words.length; index++ ) {
        var new_length;
        var last_line = lines.length - 1; // index of last line

        if ( lines[last_line].length > 0 ) {
          new_length = lines[last_line].length + 1 + words[index].length;
        } else {
          new_length = words[index].length;
        }

        // if lines would become too long then add new line
        if ( new_length > width ) {
          lines.push('');
          last_line++;
        }

        if ( lines[last_line].length > 0 ) {
          lines[last_line] = [lines[last_line], words[index]].join(' ');
        } else {
          lines[last_line] = words[index];
        }
      }
      if ( lines.length <= this.desired_line_count ) {
        // console.log("The count of lines became " + lines.length);
        // console.log(lines);
        if ( this.desired_line_count > lines.length ) {
          this.desired_line_count = lines.length;
        }
        // console.log(this.desired_line_count);
        return lines;
      }
    }
    // console.log("Reached end of loop");
  }
  
  area () {
    var lines = this.lines().map(x => x.length);
    //console.log(lines);
    return lines.length * Math.max(...lines);
  }

  // Attempt to make more lines of output
  taller() {
    this.desired_line_count++;
  }

  // Size of longest word
  min_width () {
    //console.log(this.words());
    var word_lengths = this.words().map(x => x.length);
    //console.log(word_lengths);
    var max = Math.max(...word_lengths);
    //console.log(max);
    return Math.max(...word_lengths);
  }

  // Length of all words joined
  max_width () {
    return this.words().join(' ').length;
  }

}

module.exports = Text;

"use strict";

class Text {
  constructor (value_callback = function () { return ''}, desired_line_count = 1) {
    // Parent enclosing node
    this.value = value_callback;

    // Number of desired lines in rendered output
    this.desired_line_count = desired_line_count;
  }

  get words () {
    const text = this.value();
    if ( text.match(/\S+/) ) {
      return this.value().trim().split(/\s+/);
    } else {
      return [];
    }
  }

  // Join words into lines, trying to match desired number of lines
  get lines () {
    var words = this.words;
    if ( this.desired_line_count == 1 ) {
      return [ words.join(' ') ];
    }

    var width;
    var lines;
    var index;
    const max = this.max_width;
    const longest_word = this.min_width;
    const est_min = Math.floor( max / ( this.desired_line_count + 1 ) );
    const min = longest_word > est_min ? longest_word : est_min;
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

        // If line would become too long then add new line
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
        return lines;
      }
    }
  }
  
  // Attempt to make more lines of output
  taller() {
    if ( this.desired_line_count < this.words.length ) {
      this.desired_line_count++;
    }
  }

  // Attempt to make more lines of output
  flatter() {
    if ( this.desired_line_count > 1 ) {
      this.desired_line_count--;
    }
  }

  // Size of longest word is minimum width
  get min_width () {
    return Math.max(...[this.words.map(x => x.length)]);
  }

  // Length of all words joined
  get max_width () {
    return this.words.join(' ').length;
  }

  get width () {
    return Math.max(...(this.lines.map(x => x.length)));
  }

  get height () {
    return this.lines.length;
  }

  // For text box, it becomes more narrow when becoming taller
  // Input:
  //   top    = amount top should rise
  //   bottom = amount bottom should sink
  //   left   = amount left should widen
  //   right  = amount right should widen
  adjustSize (top, bottom, left, right) {
    if ( (top+bottom) >= (left+right+1) ) {
      this.flatter();
    } else if ( (left+right) >= (top+bottom+1) ) {
      this.taller();
    }
  }

}

module.exports = Text;

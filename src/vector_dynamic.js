// A Vector where x and y are callbacks
"use strict";

const Vector = require("./vector");

class VectorDynamic extends Vector {
  constructor ( x = function(){return 0}, y = function(){return 0} ) { 
    super(x, y);
  }

  get x () { return this.call_x(); }
  get y () { return this.call_y(); }

  set x (value) { this.call_x = value }
  set y (value) { this.call_y = value } 
}

module.exports = VectorDynamic;

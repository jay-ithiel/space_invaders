const MovingObject = require("./moving_object");
const Util = require("./util");

const Ship = function(options = {}) {
  options.vel = [0,0];
  options.pos = [0,0];
  this.game = options.game;

  MovingObject.call(this, options);
};

Util.inherits(Ship, MovingObject);

Ship.prototype.power = function(impulse) {
  let xOffset = impulse[0];

  this.pos[0] += xOffset * 10;
};

module.exports = Ship;

const MovingObject = require('./moving_object');

const PowerUp = function(options) {
  this.vel = options.vel;
  this.pos = options.pos;
  this.radius = options.radius;

  MovingObject.call(this, options);
};

PowerUp.prototype.spawn = function() {
  // 40% of no drop
  // 20% shield
  // 25%

  
};

module.exports = PowerUp;

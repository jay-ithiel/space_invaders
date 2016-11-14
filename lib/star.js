const Util = require('./util');
const MovingObject = require('./moving_object');

const Star = function(options = {}) {
  options.color = "#ffffff";
  options.radius = 5;
  options.pos = options.pos || options.game.randomPosition();
  options.vel = options.vel || Util.randomVec(50);
  options.id = options.id;

  MovingObject.call(this, options);
};

Util.inherits(Star, MovingObject);

Star.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI,
    true
  );
  ctx.fill();
};

module.exports = Star;

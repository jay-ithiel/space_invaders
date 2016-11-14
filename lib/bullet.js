const Util = require('./util');
const MovingObject = require('./moving_object');

const Bullet = function(options = {}) {
  this.vel = options.vel;
  this.pos = options.pos;
  this.color = options.color;

  MovingObject.call(this, options);
};

Util.inherits(Bullet, MovingObject);

Bullet.prototype.draw = function(ctx) {
  ctx.strokeStyle = "#FF0000";
  ctx.fillStyle = "#FF0000";

  ctx.fillRect(
    this.pos[0],
    this.pos[1],
    2,
    7
  );

  // ctx.fillRect();

  // ctx.beginPath();
  // ctx.moveTo(this.pos[0], this.pos[1]);
  // ctx.lineTo((this.pos[0] + 2), (this.pos[1] - 5));
  //
  // ctx.stroke();
  // ctx.fill();
};

module.exports = Bullet;

const Util = require('./util');
const MovingObject = require('./moving_object');

const Bullet = function(options = {}) {
  this.vel = [0, 10];
  this.pos = options.pos;
  this.color = "#FF0000";
};

Util.inherits(Bullet, MovingObject);

Bullet.prototype.draw = function(ctx) {
  ctx.strokeStyle = "#FF0000";
  ctx.beginPath();
  ctx.moveTo(this.pos[0], this.pos[1]);
  ctx.lineTo(this.pos[0], (this.pos[1] + 5));
  ctx.stroke();
};

module.exports = Bullet;

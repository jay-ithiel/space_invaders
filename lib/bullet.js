const MovingObject = require('./moving_object');
const Util = require('./util');

const Bullet = function(options = {}) {
  this.vel = options.vel;
  this.pos = options.pos;
  this.color = options.color;
  this.radius = options.radius;
  this.shipSide = options.shipSide;

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
};

Bullet.prototype.collideWith = function(ship) {
  if (this.shipSide === ship.side) {
    return;
  }

  ship.death();
  this.game.remove(this);
};

module.exports = Bullet;

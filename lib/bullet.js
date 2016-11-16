const MovingObject = require('./moving_object');
const Util = require('./util');
const Shield = require('./shield');

const Bullet = function(options = {}) {
  this.vel = options.vel;
  this.pos = options.pos;
  this.color = options.color;
  this.radius = options.radius;
  this.shipSide = options.shipSide;
  this.ship = options.ship;

  MovingObject.call(this, options);
};

Util.inherits(Bullet, MovingObject);

Bullet.prototype.draw = function(ctx) {
  ctx.fillStyle = "#FF0000";

  ctx.fillRect(
    this.pos[0],
    this.pos[1],
    4,
    14
  );
};

Bullet.prototype.collideWith = function(otherObject) {
  // prevents friendly fire
  if (this.shipSide === otherObject.side) {
    return;
  }

  if (otherObject instanceof Shield) {
    console.log('handle shield break');
  } else {
    let ship = otherObject;
    ship.death();
    this.ship.currentBullet = false;
  }

  this.game.remove(this);
};

module.exports = Bullet;

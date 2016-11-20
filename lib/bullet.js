const MovingObject = require('./moving_object');
const Util = require('./util');
const ShieldPiece = require('./shield_piece');

const Bullet = function(options = {}) {
  this.id = options.id;
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
  ctx.fillStyle = this.color;

  ctx.fillRect(
    this.pos[0],
    this.pos[1],
    4,
    14
  );
};

Bullet.prototype.removeBullet = function(bulletToRemove) {
  this.game.bullets.forEach(bullet => {
    if (bullet.id === bulletToRemove.id) {
      this.game.bullets = this.game.bullets.filter(b => b.id !== bulletToRemove.id);
    }
  });
};

Bullet.prototype.collideWith = function(otherObject) {
  this.ship.bulletsInPlay.shift();

  if (this.ship.bulletsInPlay.length === 0) {
    this.ship.currentBullet = false;
  }

  // prevents friendly fire
  if (this.shipSide === otherObject.side) {
    return;
  }

  if (otherObject instanceof ShieldPiece) {
    this.game.remove(otherObject);
  } else {
    let otherShip = otherObject;
    otherShip.death();
  }

  this.game.remove(this);
};

module.exports = Bullet;

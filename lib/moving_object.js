const Util = require('./util');

const MovingObject = function(options) {
  this.color = options.color;
  this.pos = options.pos;
  this.vel = options.vel;
  this.img = options.img;
  this.game = options.game;
  this.canvasSize = options.canvasSize;
};

MovingObject.prototype.draw = function(ctx) {
  let x = this.pos[0];
  let y = this.pos[1];

  ctx.drawImage(this.img, x, y, 50, 30);
};

MovingObject.prototype.move = function() {
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];

  if (this.game.isOutOfBounds(this.pos)) {
    this.ship.bulletsInPlay.shift();
    if (this.ship.bulletsInPlay.length === 0) {
      this.ship.currentBullet = false;
    }
    this.game.remove(this);
  }
};

MovingObject.prototype.collideWith = function(otherObject) {
  // default do nothing
};

MovingObject.prototype.isCollidedWith = function(otherObject) {
  let radiusSum = this.radius + otherObject.radius;
  const centerDiff = Util.dist(this.pos, otherObject.pos);
  return centerDiff < radiusSum;
};

module.exports = MovingObject;

const MovingObject = require('./moving_object');
const Util = require('./util');

const PowerUp = function(options) {
  this.type = 'powerUp';
  this.vel = options.vel;
  this.pos = options.pos;
  this.radius = options.radius;
  this.color = options.color;
  this.game = options.game;
  this.ctx = options.ctx;

  MovingObject.call(this, options);

  this.spawn(this.ctx);
};

Util.inherits(PowerUp, MovingObject);

PowerUp.prototype.spawn = function(ctx) {
  // 40% of no drop
  // 20% shield
  // 25%
  let dropChance = Math.random() * 100;

  if (dropChance < 20) {
    this.ctx = ctx;
    this.draw(ctx);
  }

  setTimeout(() => {
    this.game.remove(this);
  }, 10000);
};

PowerUp.prototype.collideWith = function(otherObject) {
  otherObject.hasTwoGuns = true;
  this.game.remove(this);
};

PowerUp.prototype.move = function() {
  if (this.pos[1] >= this.game.DIM_Y - 70) {
    return;
  }

  this.pos[1] += this.vel[1];
};

PowerUp.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;

  ctx.beginPath();
  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI
  );
  ctx.fill();
};

module.exports = PowerUp;

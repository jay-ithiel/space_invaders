const Util = require('./util');
const MovingObject = require('./moving_object');

const Star = function(options = {}) {
  this.id = options.id;
  this.color = "#ffffff";
  this.radius = Math.random() * 1.5;
  this.pos = options.pos || options.game.randomPosition();
  this.vel = options.vel || Util.randomVec(50);
  this.game = options.game;

  MovingObject.call(this, options);
};

Util.inherits(Star, MovingObject);

Star.prototype.move = function() {
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];

  this.pos = this.game.wrap(this.pos);
};

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

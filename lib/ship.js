const MovingObject = require("./moving_object");
const Util = require("./util");
const Bullet = require('./bullet');

function Ship(options = {}) {
  options.vel = options.vel;
  options.pos = options.pos;
  options.img = options.img;
  this.img = options.img;
  this.name = options.name;
  this.canvasSize = options.canvasSize;
  this.game = options.game;

  MovingObject.call(this, options);
}

Util.inherits(Ship, MovingObject);

Ship.prototype.draw = function(ctx) {
  let x = this.pos[0];
  let y = this.pos[1];
  ctx.drawImage(this.img, x, y, 45, 35);
};

Ship.prototype.respawn = function() {
  this.pos = [
    (this.canvasSize[0] - 30) / 2,
     this.canvasSize[1] - 40
  ];
  this.vel = [0,0];
};

Ship.prototype.death = function() {
  if (this.name === 'defender') {
    this.respawn();
  } else {
    // remove ship from game
  }
};

Ship.prototype.collideWith = function(otherObject) {
  if (otherObject instanceof Bullet) {
    this.death();
  }
};

Ship.prototype.fireBullet = function() {
  console.log('you shot me!');

  let bullet = new Bullet({
    vel: this.vel,
    pos: this.pos
  });

  this.game.bullets.push(bullet);
};

Ship.prototype.reverse = function() {
  let newVel = Math.abs(this.vel[0]) + 0.1;
  if (this.vel[0] > 0) {
    newVel = 0 - newVel;
    this.vel = [newVel, 0];
    this.pos[0] -= 5;
  } else {
    this.vel = [newVel, 0];
    this.pos[0] += 5;
  }
  this.pos[1] += 40;
};

Ship.prototype.move = function() {
  if (this.pos[0] > this.canvasSize[0] - 60) {
    this.game.reverseAllInvaders();
    } else if (this.pos[0] < 20) {
    this.game.reverseAllInvaders();
  } else {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
  }
};

Ship.prototype.power = function(impulse) {

  if (this.pos[0] > this.canvasSize[0] - 60) {
    if (impulse[0] > 0) {
      return;
    }
  } else if (this.pos[0] < 20) {
    if (impulse[0] < 0) {
      return;
    }
  }

  let xOffset = impulse[0];
  this.pos[0] += xOffset * 10;
};

module.exports = Ship;

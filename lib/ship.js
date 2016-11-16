const MovingObject = require("./moving_object");
const Util = require("./util");
const Bullet = require('./bullet');

const Ship = function(options = { radius: 13 }) {
  this.name = options.name;
  this.game = options.game;
  this.canvasSize = options.canvasSize;
  this.img = options.img;
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = 17 || options.radius;
  this.side = options.side;
  this.currentBullet = false;

  MovingObject.call(this, options);
};

Util.inherits(Ship, MovingObject);

Ship.prototype.draw = function(ctx) {
  // Will use images later, but for dev purposes, use circles
  // ctx.fillStyle = "#ffffff";
  // ctx.beginPath();
  // ctx.arc(
  //   this.pos[0],
  //   this.pos[1],
  //   this.radius,
  //   0,
  //   2 * Math.PI
  // );
  // ctx.fill();

  // subtract from pos to align the image with the radius
  let x = this.pos[0] - 22;
  let y = this.pos[1] - 12;
  ctx.drawImage(this.img, x, y, 45, 35);
};

Ship.prototype.respawn = function() {
  if (this.game.defenderLives === 0) {
    debugger;
    this.game.lose();
  }
  this.pos = [
    (this.canvasSize[0] - 30) * .52,
     this.canvasSize[1] - 70
  ];
  this.vel = [0,0];
  this.game.defenderLives -= 1;
};

Ship.prototype.death = function() {
  if (this.name === 'defender') {
    this.respawn();
  } else {
    this.game.remove(this);
    this.game.increaseInvadersSpeed();
    this.currentBullet = false;
  }
};

Ship.prototype.collideWith = function(bullet) {
  if (this.side === bullet.shipSide) {
    return;
  }
  this.currentBullet = false;
};

Ship.prototype.fireBullet = function() {
  if (this.currentBullet) { return; }

  let bulletPosX = this.pos[0] + 0;
  let bulletPosY = this.pos[1];
  let bulletPos = [bulletPosX, bulletPosY];

  let bulletVel;
  if (this.name === 'defender') {
    bulletVel = [0, -5];
    bulletPosY -= 20;
  } else {
    bulletVel = [0, 5];
    bulletPosX += 20;
  }

  let bullet = new Bullet({
    vel: bulletVel,
    pos: bulletPos,
    color: "#FF0000",
    game: this.game,
    radius: 2,
    shipName: this.name,
    shipSide: this.side,
    ship: this
  });

  this.currentBullet = true;
  this.game.bullets.push(bullet);
};

Ship.prototype.reverse = function() {
  let newVel = Math.abs(this.vel[0]) + 0.02;
  if (this.vel[0] > 0) {
    newVel = 0 - newVel;
    this.vel = [newVel, 0];
    this.pos[0] -= 5;
  } else {
    this.vel = [newVel, 0];
    this.pos[0] += 5;
  }
  this.pos[1] += 20;
};

Ship.prototype.increaseSpeed = function() {
  let newVel = Math.abs(this.vel[0]) + 0.01;
  if (this.vel[0] < 0) {
    newVel = 0 - newVel;
    this.vel = [newVel, 0];
  } else {
    this.vel = [newVel, 0];
  }
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

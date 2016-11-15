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
  this.radius = 15 || options.radius;

  MovingObject.call(this, options);
};

Util.inherits(Ship, MovingObject);

Ship.prototype.draw = function(ctx) {
  // Will use images later, but for dev purposes, use circles
  // let x = this.pos[0];
  // let y = this.pos[1];
  // ctx.drawImage(this.img, x, y, 45, 35);

  ctx.fillStyle = "#ffffff";
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
    this.game.remove(this);
    // this.game.remove(otherObject);
  }
};

Ship.prototype.collideWith = function(otherObject) {
  if (otherObject instanceof Bullet) {
    this.death();
  }
  return true;
};

Ship.prototype.fireBullet = function() {
  console.log('you shot me!');

  let bulletPosX = this.pos[0] + 22.5;
  let bulletPosY = this.pos[1];
  let bulletPos = [bulletPosX, bulletPosY];

  let bullet = new Bullet({
    vel: [0, -2],
    pos: bulletPos,
    color: "#FF0000",
    game: this.game,
    radius: 2
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

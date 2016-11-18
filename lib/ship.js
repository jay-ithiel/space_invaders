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
  this.radius = options.radius;
  this.side = options.side;
  this.currentBullet = false;
  this.isDead = false;

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

  if (this.name === 'ufo') {
    let x = this.pos[0] - 26;
    let y = this.pos[1] - 3;
    ctx.drawImage(this.img, x, y, 53, 30);
    return;
  }

  // subtract from pos to align the image with the radius
  let x = this.pos[0] - 12;
  let y = this.pos[1] - 12;

  if (this.name === 'defender') {
    x -= 4;
    y -= 4;
    ctx.drawImage(this.img, x, y, 33, 33);
  } else {
    ctx.drawImage(this.img, x, y, 25, 25);
  }

};

Ship.prototype.respawn = function() {
  this.deathImage();

  this.game.defenderLives -= 1;
  if (this.game.defenderLives <= 0) {
    this.game.lose();
  }

  this.game.gameView.pause();

  setTimeout(() => {
    this.pos = [
      (this.canvasSize[0] - 30) * .52,
      this.canvasSize[1] - 70
    ];
    this.vel = [0,0];
    this.img = document.getElementById('defender');

    this.game.gameView.resume();
  }, 600);

};

Ship.prototype.death = function() {
  if (this.name === 'defender') {
    this.respawn();
  } else {
    this.game.score += this.killScore();
    this.game.increaseInvadersSpeed();
    this.currentBullet = false;
    this.isDead = true;
    this.deathImage();

    if (this.name === 'ufo') {
      this.dropPowerUp();
    };

    setTimeout(() => {
      this.game.remove(this);
    }, 200);
  }
};

Ship.prototype.deathImage = function() {
  if (this.name === 'defender') {
    this.img = document.getElementById('defender-death');
  } else {
    this.img = document.getElementById('ship-death');
  }
  this.draw(this.game.ctx);
};

Ship.prototype.dropPowerUp = function() {

};

Ship.prototype.toggleImage = function() {
  if (this.isDead) { return; }

  if (this.name === 'grunt') {
    let grunt1 = document.getElementById('grunt-1');
    let grunt2 = document.getElementById('grunt-2');
    this.img.id === 'grunt-1' ? this.img = grunt2 : this.img = grunt1;
  } else if (this.name === 'soldier') {
    let soldier1 = document.getElementById('soldier-1');
    let soldier2 = document.getElementById('soldier-2');
    this.img.id === 'soldier-1' ? this.img = soldier2 : this.img = soldier1;
  } else if (this.name === 'invader') {
    let invader1 = document.getElementById('invader-1');
    let invader2 = document.getElementById('invader-2');
    this.img.id === 'invader-1' ? this.img = invader2 : this.img = invader1;
  }
};

Ship.prototype.killScore = function() {
  if (this.name === 'grunt') {
    return 10;
  } else if (this.name === 'soldier') {
    return 20;
  } else if (this.name === 'invader') {
    return 40;
  } else if (this.name === 'ufo') {
    let ufoPoints = [50, 100, 200, 300, 500];
    let idx = Math.random() * 4;
    idx = Math.round(idx);
    return ufoPoints[idx];
  }
};

Ship.prototype.collideWith = function(bullet) {
  this.currentBullet = false;
  // bullet.ship.currentBullet = false;
  if (this.side === bullet.shipSide) {
    return;
  }
};

Ship.prototype.fireBullet = function() {
  // Early return prevents player from spamming bullets, limiting
  // the player to one bullet at a time
  if (this.currentBullet) { return; }

  let bulletPosX = this.pos[0] - 2;
  let bulletPosY = this.pos[1] - 25;
  let bulletColor;

  let bulletVel;
  if (this.name === 'defender') {
    bulletVel = [0, -4];
    bulletColor = "#FF00FF";
  } else {
    bulletVel = [0, 4];
    bulletPosY += 30;
  }

  let bulletPos = [bulletPosX, bulletPosY];

  if (this.name === 'grunt') {
    bulletColor = "#a2d3f5";
  } else if (this.name === 'soldier') {
    bulletColor = "#fdfd67";
  } else if (this.name === 'invader') {
    bulletColor = "#ff884e";
  } else if (this.name === 'ufo') {
    bulletColor = "red";
  }

  let bullet = new Bullet({
    id: this.game.bulletId,
    vel: bulletVel,
    pos: bulletPos,
    color: bulletColor,
    game: this.game,
    radius: 1,
    shipName: this.name,
    shipSide: this.side,
    ship: this
  });

  this.game.bulletId++;
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
  let newVel = Math.abs(this.vel[0]) + 0.001;
  if (this.vel[0] < 0) {
    newVel = 0 - newVel;
    this.vel = [newVel, 0];
  } else {
    this.vel = [newVel, 0];
  }
};

Ship.prototype.move = function() {

  if (this.name === 'ufo') {
    if (this.game.isOutOfBounds(this.pos)){
      this.game.remove(this);
      return;
    }

    this.pos[0] += this.vel[0];
    return;
  }

  // Player loses game if invaders move too close to the bottom
  if (this.pos[1] > this.canvasSize[1] - 100) {
    this.game.lose();
  }

  if (this.pos[0] > this.canvasSize[0] - 20) {
    this.game.reverseAllInvaders();
    } else if (this.pos[0] < 20) {
    this.game.reverseAllInvaders();
  } else {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
  }

  this.draw(this.game.ctx);
};

Ship.prototype.power = function(impulse) {
  if (this.pos[0] > this.canvasSize[0] - 20) {
    if (impulse[0] > 0) {
      return;
    }
  } else if (this.pos[0] < 20) {
    if (impulse[0] < 0) {
      return;
    }
  }

  let xOffset = impulse[0];
  this.pos[0] += xOffset;
};

module.exports = Ship;

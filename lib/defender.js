const Ship = require("./ship");
const Util = require("./util");

const Defender = function() {
  this.hasThreeGuns = false;
  this.hasFiveGuns = false;
  this.speedUp = false;
  this.speedUp2 = false;
  this.lives = 3;
};

Util.inherits(Defender, Ship);

Defender.prototype.draw = function(ctx) {
  let x = this.pos[0] - 16;
  let y = this.pos[1] - 16;
  ctx.drawImage(this.img, x, y, 33, 33);
};

Defender.prototype.respawn = function() {
  this.deathImage();

  this.game.defenderLives -= 1;
  this.hasThreeGuns = false;
  this.hasFiveGuns = false;
  this.speedUp = false;
  this.speedUp2 = false;

  if (this.game.defenderLives < 0) this.game.lose();

  this.game.gameView.pause();
  setTimeout(() => {
    this.pos = [ (this.canvasSize[0] - 30) * .52, this.canvasSize[1] - 70 ];
    this.vel = [0,0];
    this.img = document.getElementById('defender');
    this.game.gameView.resume();
  }, 600);
};

Defender.prototype.death = function() {
  if (this.game.gameView.isMuted) return;
  this.respawn();
  new Howl({ src: ['./sounds/defender_death.mp3'], volume: 0.5 }).play();
};

Defender.prototype.deathImage = function() {
  this.img = document.getElementById('defender-death');
  this.draw(this.game.ctx);
};

Defender.prototype.collideWith = function(object) {
  this.bulletsInPlay.shift();
  if (this.bulletsInPlay.length === 0) this.currentBullet = false;
  if (object.type === 'powerUp') this.handlePowerUpCollision(object);
};

Defender.prototype.handlePowerUpCollision = function(object) {
  // if (object.power === 'life') {
  //   this.game.defenderLives++;
  // } else if (object.power === 'gun') {
  //   if (this.hasThreeGuns) {
  //     this.hasFiveGuns = true;
  //   } else {
  //     this.hasThreeGuns = true;
  //   }
  // } else if (object.power === 'speed') {
  //   if (this.speedUp) {
  //     this.speedUp2 = true;
  //   } else {
  //     this.speedUp = true;
  //   }
  // }
  switch(object.power) {
    case 'life':
      this.game.defenderLives++;

    case 'gun':
      if (this.hasThreeGuns) {
        this.hasFiveGuns = true;
      } else {
        this.hasThreeGuns = true;
      }

    case 'speed':
      if (this.speedUp) {
        this.speedUp2 = true;
      } else {
        this.speedUp = true;
      }

    default:
      throw 'wtf';
  }
};

Defender.prototype.fireBullet = function() {
  if (this.currentBullet) return;

  let bulletColor = "#FF00FF", bulletVelocity = [0, -4];
  let bulletPosX = this.pos[0] - 2, bulletPosY = this.pos[1] - 25;
  let bulletPos = [bulletPosX, bulletPosY];
  let bulletPositions = this._getBulletPositions();

  bulletPositions.forEach(pos => {
    let bullet = new Bullet({
      id: this.game.bulletId,
      vel: bulletVel,
      pos: pos,
      color: bulletColor,
      game: this.game,
      radius: 1,
      shipName: this.name,
      shipSide: this.side,
      ship: this
    });

    this.game.bullets.push(bullet);
    this.bulletsInPlay.push(bullet);
    this.game.bulletId++;
  });

  this._gunSound();
  this.currentBullet = true;

  return null;
};

Defender.prototype._getBulletPositions = function() {
  let bulletPositions = [];

  if (this.hasFiveGuns) {
    bulletPositions = [
      [bulletPosX, bulletPosY],
      [bulletPosX - 8, bulletPosY +  8],
      [bulletPosX + 8, bulletPosY +  8],
      [bulletPosX - 14, bulletPosY + 16],
      [bulletPosX + 14, bulletPosY + 16]
    ];
  } else if (this.hasThreeGuns) {
    bulletPositions = [
      [bulletPosX, bulletPosY],
      [bulletPosX - 8, bulletPosY +  8],
      [bulletPosX + 8, bulletPosY +  8]
    ];
  } else {
    bulletPositions = [ [bulletPosX, bulletPosY] ];
  }

  return bulletPositions;
};

Defender.prototype._gunSound = function() {
  if (this.game.gameView.isMuted) return;

  var sound = new Howl({
    src: ['./sounds/defender_gun2.wav'],
    volume: 0.3,
  });

  sound.play();
};

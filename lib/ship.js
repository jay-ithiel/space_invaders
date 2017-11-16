const MovingObject = require("./moving_object");
const Util = require("./util");
const Bullet = require('./bullet');
const Note = require('./note');
const PowerUp = require('./power_up');

const Ship = function(options = { radius: 13 }) {
  this.id = options.id;
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
  this.hasThreeGuns = false;
  this.hasFiveGuns = false;
  this.speedUp = false;
  this.speedUp2 = false;
  this.bulletsInPlay = [];

  MovingObject.call(this, options);
};

Util.inherits(Ship, MovingObject);

Ship.prototype.removeShip = function(shipToRemove) {
  this.game.invaderShips.forEach(ship => {
    if (ship.id === shipToRemove.id) {
      this.game.invaderShips = this.game.invaderShips.filter(s => (
        s.id !== shipToRemove.id
      ));
    }
  });
};

Ship.prototype.draw = function(ctx) {
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
  this.hasThreeGuns = false;
  this.hasFiveGuns = false;
  this.speedUp = false;
  this.speedUp2 = false;

  if (this.game.defenderLives < 0) this.game.lose();
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
  let deathSound;

  if (this.name === 'defender') {
    if (!this.game.gameView.isMuted) deathSound = './sounds/defender_death.mp3';
    this.respawn();
  } else {
    this.game.score += this.killScore();
    this.game.increaseInvadersSpeed();
    this.currentBullet = false;
    this.isDead = true;
    this.deathImage();

    if (this.name === 'ufo') {
      this.dropPowerUp(this.pos);
      this.vel = [0,0];
    }


    setTimeout(() => {
      this.game.remove(this);
    }, 200);

    if (!this.game.gameView.isMuted) {
      if (this.name === 'ufo') {
        deathSound = './sounds/ufo_death.wav';
      } else {
        deathSound = './sounds/grunt_death.wav';
      }
    }
  }

  var sound = new Howl({
    src: [deathSound],
    volume: 0.5,
  });

  sound.play();
};

Ship.prototype.deathImage = function() {
  if (this.name === 'defender') {
    this.img = document.getElementById('defender-death');
  } else {
    this.img = document.getElementById('ship-death');
  }
  this.draw(this.game.ctx);
};

Ship.prototype.dropPowerUp = function(pos) {
  const powerUp = new PowerUp({
    vel: [0, 4],
    pos: pos,
    radius: 5,
    color: '#ff00ff',
    game: this.game,
    ship: this,
    ctx: this.game.ctx
  });

  this.game.powerUps.push(powerUp);
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

Ship.prototype.collideWith = function(object) {
  if (this.side === object.shipSide) return;

  this.bulletsInPlay.shift();
  if (this.bulletsInPlay.length === 0) this.currentBullet = false;

  if (object.type === 'powerUp') {
    if (this.name === 'defender') {
      if (object.power === 'life') {
        this.game.defenderLives++;
      } else if (object.power === 'gun') {
        if (this.hasThreeGuns) {
          this.hasFiveGuns = true;
        } else {
          this.hasThreeGuns = true;
        }
      } else if (object.power === 'speed') {
        if (this.speedUp) {
          this.speedUp2 = true;
        } else {
          this.speedUp = true;
        }
      }
    }
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

  if (this.hasFiveGuns) {
    let bulletPositions = [
      [bulletPosX, bulletPosY],
      [bulletPosX - 8, bulletPosY +  8],
      [bulletPosX + 8, bulletPosY +  8],
      [bulletPosX - 14, bulletPosY + 16],
      [bulletPosX + 14, bulletPosY + 16]
    ];

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

  } else if (this.hasThreeGuns) {
    let bulletPositions = [
      [bulletPosX, bulletPosY],
      [bulletPosX - 8, bulletPosY +  8],
      [bulletPosX + 8, bulletPosY +  8]
    ];

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

  } else {
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

    this.game.bullets.push(bullet);
    this.bulletsInPlay.push(bullet);
  }


  if (!this.game.gameView.isMuted) {
    let shootSound = '';
    if (this.name === 'defender') {
      shootSound = './sounds/defender_gun2.wav';
    } else if (this.name === 'ufo') {
      shootSound = './sounds/ufo_gun.wav';
    } else {
      shootSound = './sounds/defender_gun.wav'
    }

    var sound = new Howl({
      src: [shootSound],
      volume: 0.3,
    });

    sound.play();
  }

    this.game.bulletId++;
    this.currentBullet = true;
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
  if (this.speedUp) {
    let speed = this.speedUp2 ? 8 : 5;
    if (impulse[0] < 0) {
      impulse[0] = -speed;
    } else {
      impulse[0] = speed;
    }
  }

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

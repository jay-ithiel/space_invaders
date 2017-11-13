const MovingObject = require('./moving_object');
const Util = require('./util');

const PowerUp = function(options) {
  this.type = 'powerUp';
  this.vel = options.vel;
  this.pos = options.pos;
  this.radius = options.radius;
  this.color = options.color;
  this.game = options.game;
  this.ship = options.ship;
  this.ctx = options.ctx;
  this.power = null;
  this.spawned = false;

  MovingObject.call(this, options);

  this.spawn(this.ctx);
};

Util.inherits(PowerUp, MovingObject);

PowerUp.prototype.spawn = function(ctx) {
  let dropChance = Math.random() * 100;

  if (dropChance < 50) {
    let rollPowers = Math.random() * 100;
    // if (rollPowers < 20) {
    //   this.spawnLife();
    // }
    // handle logic for this later
    // else if (rollPowers < 55) {
    //   power = this.spawnSpeed();
    // }
    // else {
      // this.spawnGun();
      // this.spawnSpeed();
    // }

    if (rollPowers < 50) {
      this.spawnGun();
    } else {
      this.spawnSpeed();
    }

    setTimeout(() => {
      this.spawned = false;
      this.game.remove(this);
    }, 5000);
  }

};

PowerUp.prototype.spawnGun = function() {
  this.spawned = true;
  this.color = "#FF00FF";
  this.draw(this.ctx);
  this.power = 'gun';
};

PowerUp.prototype.spawnSpeed = function() {
  this.spawned = true;
  this.color = "#ADD8E6";
  this.draw(this.ctx);
  this.power = 'speed';
};

PowerUp.prototype.spawnLife = function() {
  this.spawned = true;
  this.color = "#66CD00";
  this.draw(this.ctx);
  this.power = 'life';
};

PowerUp.prototype.collideWith = function(otherObject) {

  if (this.type === 'powerUp') {
    if (otherObject.name === 'defender') {
      if (this.power === 'life') {
        this.game.defenderLives++;
      } else if (this.power === 'gun') {
        this.ship.hasThreeGuns = true;
      } else if (this.power === 'speed') {
        this.ship.speedUp = true;
      }
    }
  }

  this.game.remove(this);
};

PowerUp.prototype.move = function() {
  if (this.pos[1] >= this.game.DIM_Y - 70) {
    return;
  }

  this.pos[1] += this.vel[1];
};

PowerUp.prototype.draw = function(ctx) {
  if (!this.spawned) { return; }
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

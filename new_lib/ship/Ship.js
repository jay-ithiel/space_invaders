const MovingObject = require("./moving_object");
const Util = require("./util");
const Bullet = require('./bullet');
const Note = require('./note');
const PowerUp = require('./power_up');

export default class Ship extends MovingObject {
  constructor(options={radius:13}) {
    this.id = options.id;
    this.name = options.name;
    this.game = options.game;
    this.img = options.img;
    this.deathImg = options.deathImg;
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.side = options.side;
    this.currentBullet = false;
    this.isDead = false;
    this.bulletsInPlay = [];

    this.animateDeathImage = this.animateDeathImage.bind(this);
    this.collideWith = this.collideWith.bind(this);
    this.fireBullet = this.fireBullet.bind(this);
  }

  spawn(ctx) {
    // Default do nothing. Subclasses will override
  }

  removeShip() {
    
  }

  death() {

  }

  animateDeathImage() {
    this.img = this.deathImg;
    this.draw(this.game.ctx);
  }

  collideWith(obj) {
    if (this.side === obj.side) return;
  }

  fireBullet() {
    if (this.currentBullet) return;
  }
}

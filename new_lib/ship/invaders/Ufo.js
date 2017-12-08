const Invader = require("./Invader.js");
// Will need to correct path for powerUp
const PowerUp = require("../../power_up");

export default class Ufo extends Invader {
  constructor(options) {
    super(options);
    let ufoPoints = [50, 100, 200, 300, 500];
    this.killScore = ufoPoints[Math.floor(Math.random() * ufoPoints.length)];
    this.bulletColor = "red";

    this.dropPowerUp = this.dropPowerUp.bind(this);
    this._gunSound = this._gunSound.bind(this);
  }

  draw(ctx) {
    let x = this.pos[0] - 26;
    let y = this.pos[1] - 3;
    ctx.drawImage(this.img, x, y, 53, 30);
  }

  death() {
    super();

    var sound = new Howl({
      src: ['./sounds/ufo_death.wav'],
      volume: 0.5,
    }).play();

    this.dropPowerUp(this.pos);
    this.vel = [0,0];
  }

  fireBullet() {
    super(this.bulletColor);
    this._gunSound();
  }

  _gunSound() {
    if (this.game.gameView.isMuted) return;
    new Howl({
      src: ['./sounds/ufo_gun.wav'],
      volume: 0.3,
    }).play();
  }

  dropPowerUp(pos) {
    this.game.powerUps.push(new PowerUp({
      vel: [0, 4],
      pos: pos,
      radius: 5,
      color: '#ff00ff',
      game: this.game,
      ship: this,
      ctx: this.game.ctx
    }));
    // const powerUp = new PowerUp({
    //   vel: [0, 4],
    //   pos: pos,
    //   radius: 5,
    //   color: '#ff00ff',
    //   game: this.game,
    //   ship: this,
    //   ctx: this.game.ctx
    // });
    // this.game.powerUps.push(powerUp);
  }
}

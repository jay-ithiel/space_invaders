const Invader = require("./Invader");

export default class Infantry extends Invader {
  constructor(options) {
    super(options);
  }

  draw(ctx) {
    let x = this.pos[0] - 12;
    let y = this.pos[1] - 12;
    ctx.drawImage(this.img, x, y, 25, 25);
  }

  death() {
    super();
    var sound = new Howl({
      src: ['./sounds/grunt_death.wav'],
      volume: 0.5,
    }).play();
  }

  _gunSound() {
    if (this.game.gameView.isMuted) return;

    new Howl({
      src: ['./sounds/defender_gun.wav'],
      volume: 0.3,
    }).play();
  }

  increaseSpeed() {
    let newVel = Math.abs(this.vel[0]) + 0.001;
    if (this.vel[0] < 0) {
      newVel = 0 - newVel;
      this.vel = [newVel, 0];
    } else {
      this.vel = [newVel, 0];
    }
  }

  toggleImage() {
    if (this.isDead) return;
  }

  reverse() {
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
  }
}

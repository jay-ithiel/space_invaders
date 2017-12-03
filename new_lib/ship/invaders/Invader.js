const Ship = require("../Ship");

export default class Invader extends Ship {
  constructor(options) {
    super(options);
    this.killScore = 0;
  }

  move() {
    // default do nothing
  }

  death() {
    this.game.score += this.killScore;
    this.game.increaseInvadersSpeed();
    this.animateDeathImage();
    this.isDead = true;
    this.currentBullet = false;

    setTimeout(() => { this.game.remove(this); }, 200);
    if (this.game.gameView.isMuted) return;
  }

  fireBullet(bulletColor) {
    super();

    let bulletVelocity = [0, 4];
    let bulletPosX = this.pos[0] - 2, bulletPosY = this.pos[1] + 5;
    let bulletPos = [bulletPosX, bulletPosY];

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
    this.game.bulletId++;
    this.currentBullet = true;
  }
}

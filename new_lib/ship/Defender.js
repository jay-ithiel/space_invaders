const Ship = require("./Ship");

export default class Defender extends Ship {
  constructor(options) {
    super(options);
    this.hasThreeGuns = false;
    this.hasFiveGuns =  false;
    this.speedUp = false;
    this.speedUp2 = false;
    this.lives = 3;
  }

  resetPowerUps() {
    this.hasThreeGuns = false;
    this.hasFiveGuns = false;
    this.speedUp = false;
    this.speedUp2 = false;
  }

  draw(ctx) {
    let x = this.pos[0] - 16;
    let y = this.pos[1] - 16;
    ctx.drawImage(this.img, x, y, 33, 33);
  }

  respawn() {
    this.animateDeathImage();

    this.game.defenderLives -= 1;
    if (this.lives < 0) this.game.lose();
    this.resetPowerUps.bind(this)();
    this.game.gameView.pause();

    setTimeout(() => {
      this.pos = [ (this.canvasSize[0] - 30) * .52, this.canvasSize[1] - 70 ];
      this.vel = [0,0];
      this.img = document.getElementById('defender');
      this.game.gameView.resume();
    }, 600);
  }

  death() {
    this.respawn();
    if (this.game.gameView.isMuted) return;
    new Howl({ src: ['./sounds/defender_death.mp3'], volume: 0.5 }).play();
  }

  fireBullet() {
    super();

    let bulletColor = "#FF00FF", bulletVelocity = [0, -4];
    let bulletPosX = this.pos[0] - 2, bulletPosY = this.pos[1] - 25;
    let bulletPos = [bulletPosX, bulletPosY];
    let bulletPositions = this._generateBulletSpawnPos.bind(this)();

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

    this._gunSound.bind(this)();
    this.currentBullet = true;

    return null;
  }

  _generateBulletSpawnPos() {
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
  }

  _gunSound() {
    if (this.game.gameView.isMuted) return;

    var sound = new Howl({
      src: ['./sounds/defender_gun2.wav'],
      volume: 0.3,
    });

    sound.play();
  };

  collideWith(obj) {
    super(obj);
    this.bulletsInPlay.shift();
    if (this.bulletsInPlay.length === 0) this.currentBullet = false;
    if (object.type === 'powerUp') this._handlePowerUpCollision(obj);
  }

  _handlePowerUpCollision(obj) {
    switch(obj.power) {
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
  }
}

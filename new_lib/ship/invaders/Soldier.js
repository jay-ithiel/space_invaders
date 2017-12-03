const Infantry = require("./Infantry");

class Soldier extends Infantry {
  constructor(options) {
    super(options);
    this.killScore = 20;
    this.bulletColor = "#fdfd67";
  }

  fireBullet() {
    super(this.bulletColor);
    this._gunSound();
  }

  toggleImage() {
    let soldier1 = document.getElementById('soldier-1');
    let soldier2 = document.getElementById('soldier-2');
    this.img.id === 'soldier-1' ? this.img = soldier2 : this.img = soldier1;
  }
}

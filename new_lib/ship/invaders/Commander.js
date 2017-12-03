const Infantry = require("./Infantry");

class Commander extends Infantry {
  constructor(options) {
    super(options);
    this.killScore = 40;
    this.bulletColor = "#ff884e";
  }

  fireBullet() {
    super(this.bulletColor);
    this._gunSound();
  }

  toggleImage() {
    let invader1 = document.getElementById('invader-1');
    let invader2 = document.getElementById('invader-2');
    this.img.id === 'invader-1' ? this.img = invader2 : this.img = invader1;
  }
}

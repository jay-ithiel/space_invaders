const Infantry = require("./Infantry");

class Grunt extends Infantry {
  constructor(options) {
    super(options);
    this.killScore = 10;
    this.bulletColor = "#a2d3f5";
  }

  fireBullet() {
    super(this.bulletColor);
    this._gunSound();
  }
  
  toggleImage() {
    let grunt1 = document.getElementById('grunt-1');
    let grunt2 = document.getElementById('grunt-2');
    this.img.id === 'grunt-1' ? this.img = grunt2 : this.img = grunt1;
  }
}

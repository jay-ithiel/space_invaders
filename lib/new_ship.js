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
  this.bulletsInPlay = [];

  MovingObject.call(this, options);
};

Util.inherits(Ship, MovingObject);

Ship.prototype.removeShip = function() {

};

Ship.prototype.draw = function(ctx) {

};

Ship.prototype.respawn = function() {

};

Ship.prototype.death = function() {

};

Ship.prototype.deathImage = function() {

};

Ship.prototype.killScore = function() {

};

Ship.prototype.collideWith = function(object) {

};

Ship.prototype.fireBullet = function() {

};

Ship.prototype.increaseSpeed = function() {

};

Ship.prototype.move = function() {

};

module.exports = Ship;

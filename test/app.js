var assert = require('assert');
var asteroids = require('../public/build.js');

describe('asteroids', function() {
  var game = new asteroids.Game({ dim: [640, 480] });

  describe('MovingObject', function() {
    var object = new asteroids.MovingObject({ pos: [1, 1], radius: 10, vel: 1, angle: 90, turnVel: 1 });
    var collidingObject = new asteroids.MovingObject({ pos: [5, 5], radius: 8, vel: 1, angle: 270, turnVel: 0 });
    var noncollidingObject = new asteroids.MovingObject({ pos: [100, 100], radius: 10, vel: 1, angle: 0, turnVel: 0})

    it('should save properties on initialization', function() {
      assert.notStrictEqual(object.props, { pos: [1, 1], radius: 10, vel: 1, angle: 90, turnVel: 1 });
    });

    it('should calculate its next position', function() {
      assert.notStrictEqual(object.nextPosition, [0, 1]);
    });

    it('should rotate at the correct speed and in the the right direction', function() {
      object.changeAngle();

      assert.equal(object.props.angle, 91);
    });

    it('should detect whether it is collided with another object', function() {
      var collided = object.isCollidedWith(collidingObject);

      assert.equal(collided, true);
    });

    it('should detect if it is not collided with another object', function() {
      var collided = noncollidingObject.isCollidedWith(object);

      assert.equal(collided, false);
    });
  });

  describe('Asteroid', function() {
    var asteroid = new asteroids.Asteroid({ pos: [0, 0], game: game });

    it('should have velocity', function() {
      var velocityType = typeof asteroid.props.vel;

      assert.notEqual('undefined', velocityType);
    });

    it('should have angle', function() {
      var angleType = typeof asteroid.props.angle;

      assert.notEqual('undefined', angleType);
    });

    it('should have non-zero velocity', function() {
      var velocity = asteroid.props.vel;

      assert.notEqual(0, velocity);
    });
  });

  describe('Bullet', function() {

    it('should get its next position');
  });

  describe('Ship', function() {
    var ship = new asteroids.Ship({ pos: [0, 0], game: game });

    it('should relocate itself to the center of the screen', function() {
      ship.relocate();

      var x = ship.props.pos[0];
      var y = ship.props.pos[1]

      assert.equal(320, x);
      assert.equal(240, y);
    });

    it('should power itself', function() {
      ship.power(10);

      var speed = ship.props.vel;

      assert.equal(speed, 10);
    });

    it('should steer itself', function() {
      ship.steer(10);
    });

    it('should taper its speed', function() {
      ship.move();

      var speed = ship.props.vel;

      assert.equal(speed, 9.9);
    });

    it('should taper its rotation', function() {
      var rotation = ship.props.turnVel;

      assert.equal(rotation, 9.5);
    });

    it('should shoot bullets', function() {
      var bullets = game.bullets;

      assert.equal(bullets.length, 0);

      ship.shoot();

      assert.equal(bullets.length, 1);
    });
  });

  describe('Game', function() {
    it('should add asteroids', function() {
      var asteroids = game.asteroids;

      assert.notEqual(asteroids.length, 0);
    });

    it('should have one ship', function() {
      var ship = game.ship;

      assert(ship instanceof asteroids.Ship)
    });

    it('should return all its objects', function() {
      var objects = game.objects;

      assert.equal(objects.length, 22);
    });

    it('should remove objects', function() {
      var bullet = game.bullets[0];

      game.remove(bullet);

      var objects = game.objects;

      assert.equal(objects.length, 21);
    });

    it('should detect collided objects');
  });
});
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ROTATION = 3;
var LEFT = -ROTATION;
var RIGHT = ROTATION;
var FORWARD = -1;
var BACKWARD = 1;
var MAX_TURN_VEL = 12;
var MAX_VEL = 25;
var SHIP_PATH = [[0, -7], [-8, 8], [-2, 5], [2, 5], [8, 8], [0, -7]];
var LASER_PATH = [[0, 0], [0, -5], [3, -5], [3, 0]];
var ASTEROID_PATHS = [[[0, 0], [18, 25], [36, 34], [34, -25], [27, -25], [0, -24], [0, 0]], [[0, 0], [24, 37], [26, -22], [18, -25], [0, -14], [0, 0]], [[0, 0], [2, 10], [13, 8], [14, -9], [11, -15], [0, -4], [0, 0]]];

var MovingObject = function () {
  function MovingObject(options) {
    _classCallCheck(this, MovingObject);

    this.props = options;
  }

  _createClass(MovingObject, [{
    key: 'draw',
    value: function draw(ctx) {
      var _props = this.props;

      var _props$pos = _slicedToArray(_props.pos, 2);

      var x = _props$pos[0];
      var y = _props$pos[1];
      var shape = _props.shape;
      var angle = _props.angle;
      var color = _props.color;
      var fill = _props.fill;

      ctx.save();

      ctx.beginPath();

      ctx.translate(x, y);
      ctx.rotate(angle * Math.PI / 180);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = shape[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2);

          var s = _step$value[0];
          var t = _step$value[1];
          ctx.lineTo(s, t);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (fill) {
        ctx.fillStyle = '#fff';
        ctx.fill();
      } else {
        ctx.stroke();
      }

      ctx.restore();
    }
  }, {
    key: 'move',
    value: function move() {
      var _props2 = this.props;
      var radius = _props2.radius;
      var game = _props2.game;

      this.props.pos = game.wrap(this.nextPosition, radius);

      this.changeAngle();
    }
  }, {
    key: 'changeAngle',
    value: function changeAngle() {
      var _props3 = this.props;
      var turnVel = _props3.turnVel;
      var angle = _props3.angle;

      if (turnVel) {
        this.props.angle += turnVel;
      }
    }
  }, {
    key: 'isCollidedWith',
    value: function isCollidedWith(otherObject) {
      var _props4 = this.props;

      var _props4$pos = _slicedToArray(_props4.pos, 2);

      var x1 = _props4$pos[0];
      var y1 = _props4$pos[1];
      var radius = _props4.radius;

      var _otherObject$props$po = _slicedToArray(otherObject.props.pos, 2);

      var x2 = _otherObject$props$po[0];
      var y2 = _otherObject$props$po[1];

      return Math.abs(x1 - x2) < radius * 1.8 && Math.abs(y1 - y2) < radius * 1.8;
    }
  }, {
    key: 'isOutOfBounds',
    value: function isOutOfBounds(_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var X = _ref2[0];
      var Y = _ref2[1];

      var _props$pos2 = _slicedToArray(this.props.pos, 2);

      var x = _props$pos2[0];
      var y = _props$pos2[1];

      var b = 200;

      return x < -b || x > X + b || y < -b || y > Y + b;
    }
  }, {
    key: 'nextPosition',
    get: function get() {
      var _props5 = this.props;

      var _props5$pos = _slicedToArray(_props5.pos, 2);

      var x = _props5$pos[0];
      var y = _props5$pos[1];
      var vel = _props5.vel;
      var angle = _props5.angle;
      var radius = _props5.radius;

      return [x - Math.sin(angle * Math.PI / 180) * vel, y + Math.cos(angle * Math.PI / 180) * vel];
    }
  }]);

  return MovingObject;
}();

var Asteroid = function (_MovingObject) {
  _inherits(Asteroid, _MovingObject);

  function Asteroid() {
    var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var game = _ref3.game;
    var pos = _ref3.pos;
    var _ref3$vel = _ref3.vel;
    var vel = _ref3$vel === undefined ? Asteroid.randomVel() : _ref3$vel;
    var _ref3$angle = _ref3.angle;
    var angle = _ref3$angle === undefined ? Asteroid.randomAngle() : _ref3$angle;
    var _ref3$radius = _ref3.radius;
    var radius = _ref3$radius === undefined ? 20 : _ref3$radius;
    var _ref3$color = _ref3.color;
    var color = _ref3$color === undefined ? '#fff' : _ref3$color;
    var _ref3$fill = _ref3.fill;
    var fill = _ref3$fill === undefined ? false : _ref3$fill;

    _classCallCheck(this, Asteroid);

    var idx = Math.floor(Math.random() * ASTEROID_PATHS.length);
    var shape = ASTEROID_PATHS[idx];

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Asteroid).call(this, { pos: pos, vel: vel, angle: angle, radius: radius, shape: shape, color: color, game: game, fill: fill }));
  }

  _createClass(Asteroid, null, [{
    key: 'randomVel',
    value: function randomVel() {
      return Math.random() * 5 - 2.5;
    }
  }, {
    key: 'randomAngle',
    value: function randomAngle() {
      return Math.random() * 360;
    }
  }]);

  return Asteroid;
}(MovingObject);

var Bullet = function (_MovingObject2) {
  _inherits(Bullet, _MovingObject2);

  function Bullet(_ref4) {
    var pos = _ref4.pos;
    var game = _ref4.game;
    var _ref4$vel = _ref4.vel;
    var vel = _ref4$vel === undefined ? -10 : _ref4$vel;
    var _ref4$color = _ref4.color;
    var color = _ref4$color === undefined ? '#aaa' : _ref4$color;
    var _ref4$fill = _ref4.fill;
    var fill = _ref4$fill === undefined ? true : _ref4$fill;
    var _ref4$shape = _ref4.shape;
    var shape = _ref4$shape === undefined ? LASER_PATH : _ref4$shape;
    var _ref4$angle = _ref4.angle;
    var angle = _ref4$angle === undefined ? 0 : _ref4$angle;
    var _ref4$radius = _ref4.radius;
    var radius = _ref4$radius === undefined ? 1 : _ref4$radius;

    _classCallCheck(this, Bullet);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Bullet).call(this, { pos: pos, vel: vel, color: color, game: game, fill: fill, shape: shape, angle: angle, radius: radius }));
  }

  _createClass(Bullet, [{
    key: 'move',
    value: function move() {
      var _props6 = this.props;
      var radius = _props6.radius;
      var game = _props6.game;

      this.props.pos = game.nowrap(this);

      this.changeAngle();
    }
  }]);

  return Bullet;
}(MovingObject);

var Ship = function (_MovingObject3) {
  _inherits(Ship, _MovingObject3);

  function Ship(_ref5) {
    var pos = _ref5.pos;
    var game = _ref5.game;
    var _ref5$vel = _ref5.vel;
    var vel = _ref5$vel === undefined ? 0 : _ref5$vel;
    var _ref5$turnVel = _ref5.turnVel;
    var turnVel = _ref5$turnVel === undefined ? 0 : _ref5$turnVel;
    var _ref5$radius = _ref5.radius;
    var radius = _ref5$radius === undefined ? 10 : _ref5$radius;
    var _ref5$color = _ref5.color;
    var color = _ref5$color === undefined ? '#aaa' : _ref5$color;
    var _ref5$fill = _ref5.fill;
    var fill = _ref5$fill === undefined ? true : _ref5$fill;
    var _ref5$shape = _ref5.shape;
    var shape = _ref5$shape === undefined ? SHIP_PATH : _ref5$shape;
    var _ref5$angle = _ref5.angle;
    var angle = _ref5$angle === undefined ? 0 : _ref5$angle;

    _classCallCheck(this, Ship);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Ship).call(this, { pos: pos, vel: vel, turnVel: turnVel, radius: radius, color: color, game: game, fill: fill, shape: shape, angle: angle }));
  }

  _createClass(Ship, [{
    key: 'relocate',
    value: function relocate() {
      var _props$game$dim = _slicedToArray(this.props.game.dim, 2);

      var screenX = _props$game$dim[0];
      var screenY = _props$game$dim[1];

      this.props.pos = [screenX / 2, screenY / 2];
      this.props.vel = 0;
    }
  }, {
    key: 'move',
    value: function move() {
      this.props.vel = Ship.taperScalar(this.props.vel, .99);
      this.props.turnVel = Ship.taperScalar(this.props.turnVel, .95);

      _get(Object.getPrototypeOf(Ship.prototype), 'move', this).call(this);
    }
  }, {
    key: 'power',
    value: function power(impulse) {
      this.props.vel += impulse;
    }
  }, {
    key: 'steer',
    value: function steer(impulse) {
      if (this.props.turnVel < MAX_TURN_VEL) {
        this.props.turnVel += impulse;
      }
    }
  }, {
    key: 'shoot',
    value: function shoot() {
      var _props7 = this.props;
      var game = _props7.game;
      var pos = _props7.pos;
      var angle = _props7.angle;

      game.addBullet(pos, angle);
    }
  }], [{
    key: 'taperScalar',
    value: function taperScalar(n, taper) {
      return taper * n;
    }
  }]);

  return Ship;
}(MovingObject);

var Game = function () {
  function Game(_ref6) {
    var dim = _ref6.dim;
    var _ref6$asteroids = _ref6.asteroids;
    var asteroids = _ref6$asteroids === undefined ? [] : _ref6$asteroids;

    _classCallCheck(this, Game);

    this.dim = dim;
    this.asteroids = asteroids;
    this.bullets = [];

    this.addAsteroids();
    this.addShip();
  }

  _createClass(Game, [{
    key: 'addAsteroid',
    value: function addAsteroid() {
      this.asteroids.push(new Asteroid({
        game: this,
        pos: this.randomPos()
      }));
    }
  }, {
    key: 'addAsteroids',
    value: function addAsteroids() {
      setInterval(this.addAsteroid.bind(this), 1000);
    }
  }, {
    key: 'randomPos',
    value: function randomPos() {
      var _dim = _slicedToArray(this.dim, 2);

      var screenX = _dim[0];
      var screenY = _dim[1];

      return [Math.random() * screenX, Math.random() * screenY];
    }
  }, {
    key: 'addShip',
    value: function addShip() {
      var _dim2 = _slicedToArray(this.dim, 2);

      var screenX = _dim2[0];
      var screenY = _dim2[1];

      this.ship = new Ship({
        pos: [screenX / 2, screenY / 2],
        game: this
      });
    }
  }, {
    key: 'addBullet',
    value: function addBullet(pos, angle) {
      this.bullets.push(new Bullet({ game: this, pos: pos, angle: angle }));
    }
  }, {
    key: 'wrap',
    value: function wrap(_ref7, rad) {
      var _ref8 = _slicedToArray(_ref7, 2);

      var x = _ref8[0];
      var y = _ref8[1];

      var _dim3 = _slicedToArray(this.dim, 2);

      var screenX = _dim3[0];
      var screenY = _dim3[1];

      return [this._wrapFn(rad, screenX, x), this._wrapFn(rad, screenY, y)];
    }
  }, {
    key: 'nowrap',
    value: function nowrap(object) {
      var _object$props$pos = _slicedToArray(object.props.pos, 2);

      var x = _object$props$pos[0];
      var y = _object$props$pos[1];

      var _dim4 = _slicedToArray(this.dim, 2);

      var screenX = _dim4[0];
      var screenY = _dim4[1];

      if (x < 0 || y < 0 || x > screenX || y > screenY) {
        this.remove(object);
      } else return object.nextPosition;
    }
  }, {
    key: '_wrapFn',
    value: function _wrapFn(rad, max, scalar) {
      var buffer = 10;
      var bound = buffer * rad;

      if (scalar < -bound) {
        return max;
      } else {
        return scalar % (max + bound);
      }
    }
  }, {
    key: 'draw',
    value: function draw(ctx) {
      var _dim5 = _slicedToArray(this.dim, 2);

      var x = _dim5[0];
      var y = _dim5[1];

      ctx.clearRect(0, 0, x, y);

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.objects[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var obj = _step2.value;

          obj.draw(ctx);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      ctx.strokeStyle = '#aaa';
      ctx.stroke();
    }
  }, {
    key: 'moveObjects',
    value: function moveObjects() {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.objects[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var obj = _step3.value;

          obj.move();
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: 'removeObjects',
    value: function removeObjects() {
      var objects = this.objects;

      for (var i = 0; i < objects.length; i++) {
        for (var j = i + 1; j < objects.length; j++) {
          if (objects[i].isOutOfBounds(this.dim)) {
            if (objects[i] instanceof Ship) {
              continue;
            } else {
              this.remove(objects[i]);
            }
          } else if (objects[i].isCollidedWith(objects[j])) {
            if (objects[i] instanceof Ship && objects[j] instanceof Bullet) {
              continue;
            }
            if (objects[i] instanceof Ship) {
              objects[i].relocate();
            } else {
              this.remove(objects[i]);
              this.remove(objects[j]);
            }
          }
        }
      }
    }
  }, {
    key: 'remove',
    value: function remove(object) {
      var asteroids = this.asteroids;
      var bullets = this.bullets;

      if (object instanceof Asteroid) {
        asteroids.splice(asteroids.indexOf(object), 1);
      } else if (object instanceof Bullet) {
        bullets.splice(bullets.indexOf(object), 1);
      }
    }
  }, {
    key: 'objects',
    get: function get() {
      return [this.ship].concat(this.asteroids).concat(this.bullets);
    }
  }]);

  return Game;
}();

var GameView = function () {
  function GameView(_ref9) {
    var game = _ref9.game;
    var ctx = _ref9.ctx;

    _classCallCheck(this, GameView);

    this.game = game;
    this.ctx = ctx;
  }

  _createClass(GameView, [{
    key: 'start',
    value: function start() {
      this.bindKeyHandlers();

      this.requestId = requestAnimationFrame(this.step.bind(this));
    }
  }, {
    key: 'bindKeyHandlers',
    value: function bindKeyHandlers() {
      var ship = this.game.ship;
      var _Ship$prototype = Ship.prototype;
      var power = _Ship$prototype.power;
      var steer = _Ship$prototype.steer;
      var shoot = _Ship$prototype.shoot;

      key('up', power.bind(ship, FORWARD));
      key('down', power.bind(ship, BACKWARD));
      key('left', steer.bind(ship, LEFT));
      key('right', steer.bind(ship, RIGHT));
      key('space', shoot.bind(ship));
    }
  }, {
    key: 'step',
    value: function step() {
      var game = this.game;
      var ctx = this.ctx;

      game.removeObjects();
      game.moveObjects();
      game.draw(ctx);

      this.requestId = requestAnimationFrame(this.step.bind(this));
    }
  }, {
    key: 'stop',
    value: function stop() {
      cancelAnimationFrame(this.requestId);
    }
  }]);

  return GameView;
}();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MovingObject: MovingObject,
    Asteroid: Asteroid,
    Bullet: Bullet,
    Ship: Ship,
    Game: Game
  };
}

if (typeof window !== 'undefined' && window.document) {
  var canvas = document.createElement('canvas');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  new GameView({
    game: new Game({ dim: [canvas.width, canvas.height] }),
    ctx: canvas.getContext('2d')
  }).start();

  document.body = document.createElement('body');
  document.body.appendChild(canvas);
}

const ROTATION = 3
const LEFT = -ROTATION
const RIGHT = ROTATION
const FORWARD = -1
const BACKWARD = 1
const MAX_TURN_VEL = 12
const MAX_VEL = 25
const SHIP_PATH = [
  [ 0, -7],
  [-8,  8],
  [-2,  5],
  [ 2,  5],
  [ 8,  8],
  [ 0, -7]
]
const LASER_PATH = [
  [ 0, 0],
  [ 0,-5],
  [ 3,-5],
  [ 3, 0]
]
const ASTEROID_PATHS = [
  [
    [ 0,  0],
    [ 18,  25],
    [ 36, 34],
    [ 34, -25],
    [ 27, -25],
    [ 0, -24],
    [ 0,  0]
  ],
  [
    [ 0,  0],
    [ 24, 37],
    [ 26, -22],
    [ 18, -25],
    [ 0, -14],
    [ 0,  0]
  ],
  [
    [ 0,  0],
    [ 2,  10],
    [ 13, 8],
    [ 14, -9],
    [ 11, -15],
    [ 0, -4],
    [ 0,  0]
  ]
]

class MovingObject {
  constructor(options) {
    this.props = options
  }

  draw(ctx) {
    const { pos: [x, y], shape, angle, color, fill } = this.props

    ctx.save()

    ctx.beginPath()

    ctx.translate(x, y)
    ctx.rotate(angle * Math.PI / 180)

    for (let [s, t] of shape) ctx.lineTo(s, t)

    if (fill) {
      ctx.fillStyle = '#fff'
      ctx.fill()
    } else {
      ctx.stroke()
    }

    ctx.restore()
  }

  move() {
    const { radius, game } = this.props

    this.props.pos = game.wrap(this.nextPosition, radius)

    this.changeAngle()
  }

  changeAngle() {
    const { turnVel, angle } = this.props

    if (turnVel) {
      this.props.angle += turnVel
    }
  }

  get nextPosition() {
    const { pos: [x, y], vel, angle, radius } = this.props

    return [
      x - Math.sin(angle * Math.PI / 180) * vel,
      y + Math.cos(angle * Math.PI / 180) * vel
    ]
  }

  isCollidedWith(otherObject) {
    const { pos: [x1, y1], radius } = this.props
    const [x2, y2] = otherObject.props.pos

    return (
      Math.abs(x1 - x2) < radius * 1.8 &&
      Math.abs(y1 - y2) < radius * 1.8
    )
  }

  isOutOfBounds([X, Y]) {
    const { pos: [x, y] } = this.props
    const b = 200

    return x<-b || x>X+b || y<-b || y>Y+b
  }
}

class Asteroid extends MovingObject {
  constructor({ game, pos, vel = Asteroid.randomVel(), angle = Asteroid.randomAngle(), radius = 20, color = '#fff', fill = false } = {}) {
    const idx = Math.floor(Math.random() * ASTEROID_PATHS.length);
    const shape = ASTEROID_PATHS[idx];

    super({ pos, vel, angle, radius, shape, color, game, fill })
  }

  static randomVel() {
    return Math.random() * 5 - 2.5
  }

  static randomAngle() {
    return Math.random() * 360
  }
}

class Bullet extends MovingObject {
  constructor({pos, game, vel=-10, color='#aaa', fill=true, shape=LASER_PATH, angle=0, radius=1}) {
    super({pos, vel, color, game, fill, shape, angle, radius })
  }

  move() {
    const { radius, game } = this.props

    this.props.pos = game.nowrap(this)

    this.changeAngle()
  }
}

class Ship extends MovingObject {
  constructor({ pos, game, vel=0, turnVel=0, radius = 10, color = '#aaa', fill = true, shape = SHIP_PATH, angle = 0 }) {
    super({ pos, vel, turnVel, radius, color, game, fill, shape, angle })
  }

  relocate() {
    const [screenX, screenY] = this.props.game.dim

    this.props.pos = [screenX/2, screenY/2]
    this.props.vel = 0
  }

  move() {
    this.props.vel = Ship.taperScalar(this.props.vel, .99)
    this.props.turnVel = Ship.taperScalar(this.props.turnVel, .95)

    super.move()
  }

  static taperScalar(n, taper) {
    return taper * n
  }

  power(impulse) {
    this.props.vel += impulse
  }

  steer(impulse) {
    if (this.props.turnVel < MAX_TURN_VEL) {
      this.props.turnVel += impulse
    }
  }

  shoot() {
    const { game, pos, angle } = this.props

    game.addBullet(pos, angle)
  }
}


class Game {
  constructor({dim, asteroids=[]}) {
    this.dim = dim
    this.asteroids = asteroids
    this.bullets = []

    this.addAsteroids()
    this.addShip()
  }

  addAsteroid() {
    this.asteroids.push(new Asteroid({
      game: this,
      pos: this.randomPos()
    }))
  }

  addAsteroids() {
    setInterval(this.addAsteroid.bind(this), 1000) 
  }

  randomPos() {
    const [screenX, screenY] = this.dim

    return [
      Math.random() * screenX,
      Math.random() * screenY
    ]
  }

  addShip() {
    const [screenX, screenY] = this.dim

    this.ship = new Ship({
      pos: [screenX/2, screenY/2],
      game: this
    })
  }

  addBullet(pos, angle) {
    this.bullets.push(
      new Bullet({game: this, pos, angle})
    )
  }

  wrap([x, y], rad) {
    const [screenX, screenY] = this.dim

    return [
      this._wrapFn(rad, screenX, x),
      this._wrapFn(rad, screenY, y)
    ]
  }

  nowrap(object) {
    const [x, y] = object.props.pos
    const [screenX, screenY] = this.dim

    if (x<0 || y<0 || x>screenX || y>screenY) {
      this.remove(object)
    } else return object.nextPosition
  }

  _wrapFn(rad, max, scalar) {
    const buffer = 10
    const bound = buffer * rad

    if (scalar < -bound) {
      return max
    } else {
      return scalar % (max + bound)
    }
  }

  draw(ctx) {
    const [x, y] = this.dim

    ctx.clearRect(0, 0, x, y)

    for (let obj of this.objects)
      obj.draw(ctx)

    ctx.strokeStyle = '#aaa'
    ctx.stroke()
  }

  get objects() {
    return [this.ship].concat(this.asteroids).concat(this.bullets)
  }

  moveObjects() {
    for (let obj of this.objects)
      obj.move()
  }

  removeObjects() {
    const { objects } = this

    for (var i=0; i<objects.length; i++) {
      for (var j=i+1; j<objects.length; j++) {
        if (objects[i].isOutOfBounds(this.dim)) {
          if (objects[i] instanceof Ship) {
            continue
          } else {
            this.remove(objects[i])
          }
        } else if (objects[i].isCollidedWith(objects[j])) {
          if (objects[i] instanceof Ship && objects[j] instanceof Bullet) {
            continue
          }
          if (objects[i] instanceof Ship) {
            objects[i].relocate()
          } else {
            this.remove(objects[i])
            this.remove(objects[j])
          }
        }
      }
    }
  }

  remove(object) {
    const { asteroids, bullets } = this

    if (object instanceof Asteroid) {
      asteroids.splice(asteroids.indexOf(object), 1)
    } else if (object instanceof Bullet) {
      bullets.splice(bullets.indexOf(object), 1)
    }
  }
}

class GameView {
  constructor({game, ctx}) {
    this.game = game
    this.ctx = ctx
  }

  start() {
    this.bindKeyHandlers()

    this.requestId = requestAnimationFrame(this.step.bind(this))
  }

  bindKeyHandlers() {
    const { ship } = this.game
    const { power, steer, shoot } = Ship.prototype

    key('up', power.bind(ship, FORWARD))
    key('down', power.bind(ship, BACKWARD))
    key('left', steer.bind(ship, LEFT))
    key('right', steer.bind(ship, RIGHT))
    key('space', shoot.bind(ship))
  }

  step() {
    const { game, ctx } = this

    game.removeObjects()
    game.moveObjects()
    game.draw(ctx)

    this.requestId = requestAnimationFrame(this.step.bind(this))
  }

  stop() {
    cancelAnimationFrame(this.requestId)
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MovingObject,
    Asteroid,
    Bullet,
    Ship,
    Game
  }
}

if (typeof window !== 'undefined' && window.document) {
  const canvas = document.createElement('canvas')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  new GameView({
    game: new Game({dim: [canvas.width, canvas.height]}),
    ctx: canvas.getContext('2d')
  }).start()

  document.body = document.createElement('body')
  document.body.appendChild(canvas)
}
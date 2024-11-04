import { Collider, Entity, Mesh } from "./engine/entity";
import { State, StateMachine } from "./utils/stateMachine";
import { Vec } from "./utils/vector";
import { gsap } from "gsap";
import { withLogging } from "./utils/debug.js";

// Input State Machine

function getRandomInt({ min = 0, max, steps = 2 }) {
  return (Math.floor(steps * Math.random()) / (steps - 1)) * (max - min) + min;
}

class Command {
  constructor() {
    this.type = Object.getPrototypeOf(this).constructor;
  }
}

class AttackCommand extends Command {
  constructor(playerIndex) {
    super();
    this.playerIndex = playerIndex;
  }
}
class MoveCommand extends Command {
  constructor(playerIndex, direction) {
    super();
    this.playerIndex = playerIndex;
    this.direction = direction;
  }
}

class TickCommand extends Command {
  constructor(delta) {
    super();
    this.delta = delta;
  }
}

class OpenInputState extends State {
  update(game, inputStateMachine, inputState) {
    const leftDir =
      (inputState["w"] !== undefined) - +(inputState["s"] !== undefined);

    const rightDir =
      (inputState["arrowup"] !== undefined) -
      +(inputState["arrowdown"] !== undefined);
    game.commands.push(new MoveCommand(0, leftDir));
    if (inputState["d"] !== undefined) {
      game.commands.push(new AttackCommand(0));
    }
    game.commands.push(new MoveCommand(1, rightDir));
    if (inputState["arrowleft"] !== undefined) {
      game.commands.push(new AttackCommand(1));
    }
  }
}

class InputStateManager extends StateMachine {
  constructor() {
    super();
    this.pushState(new OpenInputState());
  }

  init() {}

  update(game, inputState) {
    this.currentState()?.update(game, this, inputState);
  }
}

// Game

const clipToScreenSpace = ([x, y]) => [(x + 1) / 2, (y + 1) / 2];

class Paddle extends Entity {
  static attackTime = 0.2;
  static attackDistance = 0.1;

  constructor({ position, color, attackDir }) {
    super({
      position,
      collider: new Collider("box", new Vec(0.02, 0.2)),
      mesh: new Mesh("box", new Vec(0.02, 0.2), color),
    });
    this.origin = position.clone();
    this.attackDir = attackDir.mul(Paddle.attackDistance);
    this.size = new Vec(0.02, 0.2);
    this.direction = 0;
    this.attackData = {
      time: 0,
    };
  }

  isAttacking() {
    return this.attackData.time > 0.8 * Paddle.attackTime;
  }

  attackAnimation() {
    this.position.x =
      this.origin.x +
      this.attackDir.x.mix(
        0,
        1 - (this.attackData.time / Paddle.attackTime).clamp(0, 1)
      );
  }

  update(delta) {
    this.position.y += delta * this.direction * 2;
    this.position.y = Math.min(
      Math.max(this.position.y, -1 + this.size.y),
      1 - this.size.y
    );
    this.attackData.time -= delta;
    this.attackAnimation();
  }

  attack() {
    if (this.attackData.time > 0) {
      return;
    }

    this.attackData.time = Paddle.attackTime;
    this.position.add(this.attackDir.clone().mul(Paddle.attackDistance));
  }
}

class Ball extends Entity {
  constructor({ position, velocity }) {
    const color = new Vec(1, 1, 1, 1);
    super({
      position,
      velocity,
      collider: new Collider("sphere", new Vec(0.05, 0.05)),
      mesh: new Mesh("sphere", new Vec(0.05, 0.05), color),
    });
    this.size = 0.05;
  }
}

class FloatingBall extends Entity {
  constructor({ position, size, triggerSize }) {
    const color = new Vec(0, 0, 0, 1);
    super({
      position,
      collider: new Collider("sphere", new Vec(triggerSize, triggerSize)),
      mesh: new Mesh("sphere", new Vec(size, size), color),
    });
    this.size = size;
    this.origin = position.clone();
  }
}

class Particle extends Entity {
  constructor({ position, color, size, velocity, totalTime, timeToLive }) {
    super({
      position,
      velocity,
      mesh: new Mesh("sphere", new Vec(size, size), color),
    });
    this.size = size;
    this.orginalColor = color.clone();
    this.originalScale = size;
    this.totalTime = totalTime;
    this.timeToLive = totalTime;
  }
}

class Wall extends Entity {
  constructor({ position, scale }) {
    super({
      position,
      collider: new Collider("box", scale),
      mesh: new Mesh("box", new Vec(scale, scale)),
    });
  }
}

class MyGame {
  constructor(data) {
    this.commands = [];
    this.data = data;
    this.bounce = new Audio("./bounce.wav");
    data.listeners.push(this);
    this.data.state.balls = this.setupBalls();
    this.data.state.ball = new Ball({
      position: new Vec(0, 0),
      velocity: new Vec(0.6, 0.8).mul(2),
    });

    this.data.state.paddles = [
      new Paddle({
        position: new Vec(-1.9, 0),
        color: new Vec(1, 0, 0, 1),
        attackDir: new Vec(1, 0),
      }),
      new Paddle({
        position: new Vec(1.9, 0),
        color: new Vec(0, 1, 0, 1),
        attackDir: new Vec(-1, 0),
      }),
    ];
    this.data.state.walls = [
      new Wall({ position: new Vec(-3, 0), scale: new Vec(1, 4) }),
      new Wall({ position: new Vec(3, 0), scale: new Vec(1, 4) }),
      new Wall({ position: new Vec(0, 2), scale: new Vec(6, 1) }),
      new Wall({ position: new Vec(0, -2), scale: new Vec(6, 1) }),
    ];
    this.data.state.particles = [];
  }

  setupBalls() {
    const balls = [];
    for (var i = 0; i < 400; i++) {
      const origin = new Vec(
        getRandomInt({ max: 1.2, min: -1.5, steps: 200 }),
        getRandomInt({ max: 0.95, min: -0.95, steps: 100 })
      );
      const size = getRandomInt({ max: 0.02, min: 0.01, steps: 5 });
      balls.push(
        new FloatingBall({
          position: origin,
          size,
          triggerSize: 0.1,
        })
      );
    }
    return balls;
  }

  configUpdated() {
    if (!this.data.state.lines) {
      this.data.state.lines = [];
    }
  }

  updateColor(color) {
    this.activeColor = structuredClone(color);
    this.activeColor.push(1);
    this.currLine.color = this.activeColor;
  }

  moveBall(delta) {
    const { ball, walls, paddles, particles } = this.data.state;
    ball.position.x += delta * ball.velocity.x;
    ball.position.y += delta * ball.velocity.y;

    var hit = { hit: false };

    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      const collision = ball.collides(wall);
      if (collision) {
        // check if the ball needs to be moved out
        const a = this.bounce.cloneNode();
        a.playbackRate = getRandomInt({
          max: 0.4,
          min: 0.2,
          steps: 100,
        });
        a.volume = 0;
        a.play();
        const newPos = collision.collisionPoint
          .clone()
          .add(collision.normal.clone().mul(ball.mesh.scale));

        if (newPos.clone().sub(ball.position).dot(collision.normal) < 0) {
          ball.position = newPos;
        }
        if (ball.velocity.dot(collision.normal) < 0) {
          hit.startVelocity = ball.velocity.clone();
          hit.normal = collision.normal;
          const ortho = Vec.Z3.clone().cross(collision.normal).normalize();

          ortho.mul(ortho.dot(ball.velocity));

          const delta = ball.velocity.clone().sub(ortho);
          ball.velocity.add(delta.mul(-2));
          // reflect the velocity about the implied line of the normal
          hit.hit = true;
          hit.endVelocity = ball.velocity.clone();
        }
      }
    }
    for (let i = 0; i < paddles.length; i++) {
      const paddle = paddles[i];
      const collision = ball.collides(paddle);
      if (collision) {
        // check if the ball needs to be moved out
        const newPos = collision.collisionPoint
          .clone()
          .add(collision.normal.clone().mul(ball.mesh.scale));

        if (newPos.clone().sub(ball.position).dot(collision.normal) < 0) {
          ball.position = newPos;
        }

        if (ball.velocity.dot(collision.normal) < 0) {
          hit.startVelocity = ball.velocity.clone();
          hit.normal = collision.normal;
          const ortho = Vec.Z3.clone().cross(collision.normal).normalize();

          ortho.mul(ortho.dot(ball.velocity));

          const delta = ball.velocity.clone().sub(ortho);
          // reflect the velocity about the implied line of the normal
          ball.velocity.add(delta.mul(-2));
          ball.mesh.color = paddle.mesh.color;
          hit.hit = true;
          if (paddle.isAttacking()) {
            ball.velocity.add(delta.mul(0.4));
          }
          if (paddle.direction) {
            ball.velocity.y += paddle.direction * 1;
          }
          hit.endVelocity = ball.velocity.clone();
        }
      }
    }

    if (!hit.hit && getRandomInt({ max: 1, min: 0, steps: 100 }) > 0.1) {
      const back = Math.atan2(ball.velocity.x, ball.velocity.y) + Math.PI;
      const angle = back + getRandomInt({ max: 1, min: -1, steps: 100 });
      const posAngle =
        back +
        getRandomInt({ max: Math.PI / 4, min: -Math.PI / 4, steps: 100 });
      const posRad = ball.mesh.scale.len();
      particles.push(
        new Particle({
          position: ball.position
            .clone()
            .add(
              Vec.ONE2.clone().mul(
                new Vec(Math.sin(posAngle), Math.cos(posAngle)).mul(posRad)
              )
            ),
          color: ball.mesh.color.clone(),
          size: 0.01,
          velocity: new Vec(Math.sin(angle), Math.cos(angle)).mul(
            getRandomInt({ max: 0.1, min: 0.01, steps: 200 })
          ),
          totalTime: 0.2,
        })
      );
    }
    if (hit.hit) {
      const tl = gsap.timeline();
      const hitForce = 1 - Math.abs(ball.velocity.dot(hit.normal)).clamp(0, 1);
      if (hit.normal.x !== 0) {
        tl.fromTo(
          ball.mesh.scale,
          { x: (ball.size / 3).mix(ball.size, hitForce) },
          { duration: 1.5, x: ball.size, ease: "elastic.out" }
        ).fromTo(
          ball.mesh.scale,
          { y: (1.5 * ball.size).mix(ball.size, hitForce) },
          { duration: 1.5, y: ball.size, ease: "elastic.out" },
          "<"
        );
      } else {
        tl.fromTo(
          ball.mesh.scale,
          { y: (ball.size / 3).mix(ball.size, hitForce) },
          { duration: 1.5, y: ball.size, ease: "elastic.out" }
        ).fromTo(
          ball.mesh.scale,
          { x: (1.5 * ball.size).mix(ball.size, hitForce) },
          { duration: 1.5, x: ball.size, ease: "elastic.out" },
          "<"
        );
      }
    }
    return hit;
  }

  spawnParticles({ startVelocity, endVelocity, normal }) {
    const { ball, particles } = this.data.state;

    if (endVelocity.normalize().dot(startVelocity.normalize()) > 0 || true) {
      const endEnd = endVelocity.clone().add(startVelocity).normalize();
      const startStart = endEnd.clone().mul(-1);

      const startStartAngle = Math.atan2(startStart.y, startStart.x) + Math.PI;
      startVelocity.mul(-1);
      const startEndAngle =
        Math.atan2(startVelocity.y, startVelocity.x) + Math.PI;

      const startDelta = startEndAngle - startStartAngle;

      const endStartAngle = Math.atan2(endVelocity.y, endVelocity.x) + Math.PI;
      const endEndAngle = Math.atan2(endEnd.y, endEnd.x) + Math.PI;

      const endDelta = endEndAngle - endStartAngle;

      const max = endDelta + startDelta;
      const orthoAngle = Math.atan2(normal.x, normal.y);

      const weight = Math.abs(normal.dot(startVelocity.clone().normalize()));

      const count =
        10 * weight +
        getRandomInt({
          max: 10 * weight,
          min: 0,
          steps: 11,
        });
      for (let i = 0; i < count; i++) {
        const delta = getRandomInt({
          max: Math.PI / 2,
          min: Math.PI / 3,
          steps: 200,
        });

        const angle =
          orthoAngle +
          delta *
            getRandomInt({
              max: 1,
              min: -1,
              steps: 2,
            });

        particles.push(
          new Particle({
            position: ball.position.clone(),
            color: ball.mesh.color.clone(),
            size: 0.01,
            velocity: new Vec(Math.sin(angle), Math.cos(angle)).mul(
              getRandomInt({ max: 1, min: 0.4, steps: 200 })
            ),
            totalTime: 0.4,
          })
        );
      }
    } else {
      return;
      for (let i = 0; i < 100; i++) {
        const angle = getRandomInt({ max: Math.PI, min: -Math.PI, steps: 200 });
        particles.push({
          position: ball.position.clone(),
          color: new Vec(1, 1, 1),
          size: 0.01,
          velocity: new Vec(Math.sin(angle), Math.cos(angle)),
          timeToLive: 1,
        });
      }
    }
  }

  applyCommand(command) {
    switch (command.type) {
      case MoveCommand:
        {
          this.data.state.paddles[command.playerIndex].direction =
            command.direction;
        }
        break;
      case AttackCommand:
        {
          this.data.state.paddles[command.playerIndex].attack();
        }
        break;
      case TickCommand:
        const { delta } = command;
        const { ball, balls, paddles, particles } = this.data.state;
        var hit = this.moveBall(delta);

        for (let i = 0; i < balls.length; i++) {
          const other = balls[i];
          other.mesh.color.sub(Vec.ONE3.clone().mul(2 * delta)).max(Vec.ZERO3);
          if (other.collides(ball)) {
            other.mesh.color.copy(ball.mesh.color).mul(3);
          }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.position.add(p.velocity.clone().mul(delta));
          p.timeToLive -= delta;
          p.mesh.scale = Vec.ONE2.clone().mul(
            (p.size * p.timeToLive) / p.totalTime
          );
          if (p.timeToLive <= 0) {
            particles.splice(i, 1);
          }
        }

        // check intersections
        for (let i = 0; i < paddles.length; i++) {
          paddles[i].update(delta);
        }

        if (hit.hit) {
          this.spawnParticles(hit);
        }

        break;
      default:
        break;
    }
  }

  update(deltaTime) {
    this.commands.push(new TickCommand(deltaTime));
    this.commands.forEach((command) => {
      this.applyCommand(command);
    });
    this.commands.length = 0;
  }
}

export { InputStateManager, MyGame };

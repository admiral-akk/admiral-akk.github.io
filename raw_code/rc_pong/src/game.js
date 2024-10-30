import { State, StateMachine } from "./utils/stateMachine";
import { Vec, LineSegment } from "./utils/vector";

// Input State Machine

function getRandomInt({ min = 0, max, steps = 2 }) {
  return (Math.floor(steps * Math.random()) / (steps - 1)) * (max - min) + min;
}

class Command {
  constructor() {
    this.type = Object.getPrototypeOf(this).constructor;
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
    game.commands.push(new MoveCommand(1, rightDir));
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

const inputState = new InputStateManager();

// Game

const clipToScreenSpace = ([x, y]) => [(x + 1) / 2, (y + 1) / 2];

class MyGame {
  constructor(data) {
    this.commands = [];
    this.data = data;
    data.listeners.push(this);
    if (this.data.state.ball) {
      this.data.state.ball.size = 0.1;
    }
    this.data.state.balls = this.setupBalls();
    this.data.state.ball = {
      position: new Vec(0, 0),
      color: new Vec(1, 1, 1),
      size: 0.05,
      velocity: new Vec(0.8, 0.4).mul(2),
    };
    this.data.state.paddles = [
      {
        position: new Vec(-1.9, 0),
        size: new Vec(0.02, 0.2),
        color: new Vec(1, 0, 0),
        direction: 0,
      },
      {
        position: new Vec(1.9, 0),
        size: new Vec(0.02, 0.2),
        color: new Vec(0, 1, 0),
        direction: 0,
      },
    ];
    this.data.saveData();
    this.activeColor = [1, 1, 1, 1];
    this.currLine = { start: [0, 0], end: [0, 0], color: this.activeColor };
  }

  setupBalls() {
    const balls = [];
    for (var i = 0; i < 1; i++) {
      const origin = new Vec(
        getRandomInt({ max: 1.2, min: -1.5, steps: 200 }),
        getRandomInt({ max: 0.95, min: -0.95, steps: 100 })
      );
      balls.push({
        origin: origin,
        position: origin.clone(),
        color: new Vec(0, 0, 0),
        size: getRandomInt({ max: 0.02, min: 0.01, steps: 5 }),
      });
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
    const { ball } = this.data.state;
    ball.position.x += delta * ball.velocity.x;
    ball.position.y += delta * ball.velocity.y;

    if (Math.abs(ball.position.x) + ball.size >= 2) {
      ball.velocity.x *= -1;
    }
    if (Math.abs(ball.position.y) + ball.size >= 1) {
      ball.velocity.y *= -1;
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
      case TickCommand:
        const { delta } = command;
        const { ball, balls, paddles } = this.data.state;
        this.moveBall(delta);
        for (let i = 0; i < balls.length; i++) {
          const other = balls[i];
          other.color.sub(Vec.ONE3.clone().mul(2 * delta)).max(Vec.ZERO3);
          const deltaV = other.position.clone().sub(ball.position);
          if (deltaV.len() < 0.15) {
            other.color.copy(ball.color).mul(3);
          }
        }

        // check intersections

        for (let i = 0; i < paddles.length; i++) {
          const p = paddles[i];
          p.position.y += delta * p.direction * 2;
          p.position.y = Math.min(
            Math.max(p.position.y, -1 + p.size.y),
            1 - p.size.y
          );

          const size = new Vec(p.size);
          const top = new Vec(p.position).add(p.size);
          const bot = new Vec(p.position).sub(p.size);
          const lineSegments = [
            new LineSegment(
              top.clone(),
              top.clone().sub(size.clone().mul(Vec.X2).mul(2))
            ),
            new LineSegment(
              top.clone(),
              top.clone().sub(size.clone().mul(Vec.Y2).mul(2))
            ),
            new LineSegment(
              bot.clone(),
              bot.clone().add(size.clone().mul(Vec.X2).mul(2))
            ),
            new LineSegment(
              bot.clone(),
              bot.clone().add(size.clone().mul(Vec.Y2).mul(2))
            ),
          ];

          for (let j = 0; j < lineSegments.length; j++) {
            const l = lineSegments[j];
            const dist = l.distanceTo(ball.position);
            if (dist < ball.size) {
              ball.color = p.color;
              if (Math.sign(ball.velocity.x) != Math.sign(0.5 - i)) {
                ball.velocity.x *= -1;
              }
            }
          }
        }
        this.data.saveData();
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

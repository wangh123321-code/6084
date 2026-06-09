import Phaser from 'phaser';
import { ObstacleType, OBSTACLE_CONFIGS, GameConfig } from './GameConfig';

export class Obstacle extends Phaser.Physics.Arcade.Sprite {
  private obstacleType: ObstacleType;
  private isActive: boolean = false;

  constructor(scene: Phaser.Scene, type: ObstacleType) {
    const config = OBSTACLE_CONFIGS[type];
    super(scene, -100, GameConfig.GROUND_Y - config.height / 2, `obstacle_${type}`);

    this.obstacleType = type;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);
    body.setAllowGravity(false);
    body.setSize(config.width * 0.8, config.height * 0.8);

    this.setActive(false);
    this.setVisible(false);
    this.setDepth(8);
  }

  spawn(x: number, y: number): void {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.isActive = true;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = true;

    if (this.obstacleType === 'dog') {
      this.scene.tweens.add({
        targets: this,
        y: y - 5,
        duration: 200,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  update(speed: number, delta: number): void {
    if (!this.isActive) return;

    this.x -= speed * (delta / 1000);

    if (this.x < -100) {
      this.recycle();
    }
  }

  recycle(): void {
    this.isActive = false;
    this.setActive(false);
    this.setVisible(false);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = false;

    this.scene.tweens.killTweensOf(this);
    this.setPosition(-100, -100);
  }

  getType(): ObstacleType {
    return this.obstacleType;
  }

  getIsActive(): boolean {
    return this.isActive;
  }
}

export class ObstaclePool {
  private scene: Phaser.Scene;
  private pool: Map<ObstacleType, Obstacle[]> = new Map();
  private maxPerType: number = 10;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.initializePool();
  }

  private initializePool(): void {
    const types: ObstacleType[] = ['bottle', 'fence', 'dog'];
    types.forEach(type => {
      const obstacles: Obstacle[] = [];
      for (let i = 0; i < this.maxPerType; i++) {
        obstacles.push(new Obstacle(this.scene, type));
      }
      this.pool.set(type, obstacles);
    });
  }

  getObstacle(type: ObstacleType): Obstacle | null {
    const obstacles = this.pool.get(type);
    if (!obstacles) return null;

    const available = obstacles.find(o => !o.getIsActive());
    return available || null;
  }

  spawnRandom(): Obstacle | null {
    const types: ObstacleType[] = ['bottle', 'fence', 'dog'];
    const weights = [0.5, 0.3, 0.2];

    let rand = Math.random();
    let typeIndex = 0;
    for (let i = 0; i < weights.length; i++) {
      rand -= weights[i];
      if (rand <= 0) {
        typeIndex = i;
        break;
      }
    }

    const type = types[typeIndex];
    const obstacle = this.getObstacle(type);
    if (obstacle) {
      const config = OBSTACLE_CONFIGS[type];
      const y = GameConfig.GROUND_Y - config.height / 2;
      obstacle.spawn(GameConfig.WIDTH + 50, y);
    }
    return obstacle;
  }

  updateAll(speed: number, delta: number): void {
    this.pool.forEach(obstacles => {
      obstacles.forEach(o => o.update(speed, delta));
    });
  }

  getAllActive(): Obstacle[] {
    const active: Obstacle[] = [];
    this.pool.forEach(obstacles => {
      obstacles.forEach(o => {
        if (o.getIsActive()) active.push(o);
      });
    });
    return active;
  }

  reset(): void {
    this.pool.forEach(obstacles => {
      obstacles.forEach(o => o.recycle());
    });
  }

  destroy(): void {
    this.pool.forEach(obstacles => {
      obstacles.forEach(o => o.destroy());
    });
    this.pool.clear();
  }
}

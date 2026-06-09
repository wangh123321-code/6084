import Phaser from 'phaser';
import { GameConfig, COLORS } from './GameConfig';

export class Background {
  private scene: Phaser.Scene;
  private skyLayer: Phaser.GameObjects.TileSprite | null = null;
  private farTreesLayer: Phaser.GameObjects.TileSprite | null = null;
  private nearBushesLayer: Phaser.GameObjects.TileSprite | null = null;
  private groundLayer: Phaser.GameObjects.TileSprite | null = null;
  private speedLines: Phaser.GameObjects.Graphics | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createLayers();
  }

  private createLayers(): void {
    this.skyLayer = this.scene.add.tileSprite(
      0, 0,
      GameConfig.WIDTH, 300,
      'bg_sky'
    ).setOrigin(0, 0);
    this.skyLayer.setScrollFactor(0);
    this.skyLayer.setDepth(0);

    this.farTreesLayer = this.scene.add.tileSprite(
      0, GameConfig.GROUND_Y - 200,
      GameConfig.WIDTH, 200,
      'bg_far_trees'
    ).setOrigin(0, 0);
    this.farTreesLayer.setScrollFactor(0);
    this.farTreesLayer.setDepth(1);

    this.nearBushesLayer = this.scene.add.tileSprite(
      0, GameConfig.GROUND_Y - 100,
      GameConfig.WIDTH, 100,
      'bg_near_bushes'
    ).setOrigin(0, 0);
    this.nearBushesLayer.setScrollFactor(0);
    this.nearBushesLayer.setDepth(2);

    this.groundLayer = this.scene.add.tileSprite(
      0, GameConfig.GROUND_Y,
      GameConfig.WIDTH, 80,
      'ground'
    ).setOrigin(0, 0);
    this.groundLayer.setScrollFactor(0);
    this.groundLayer.setDepth(3);

    this.speedLines = this.scene.add.graphics();
    this.speedLines.setDepth(5);
    this.speedLines.setAlpha(0);
  }

  update(speed: number, delta: number, isBoost: boolean): void {
    const baseSpeed = speed * (delta / 1000);

    if (this.skyLayer) {
      this.skyLayer.tilePositionX += baseSpeed * 0.1;
    }
    if (this.farTreesLayer) {
      this.farTreesLayer.tilePositionX += baseSpeed * 0.3;
    }
    if (this.nearBushesLayer) {
      this.nearBushesLayer.tilePositionX += baseSpeed * 0.6;
    }
    if (this.groundLayer) {
      this.groundLayer.tilePositionX += baseSpeed;
    }

    this.updateSpeedLines(speed, isBoost);
  }

  private updateSpeedLines(speed: number, isBoost: boolean): void {
    if (!this.speedLines) return;

    this.speedLines.clear();

    const targetAlpha = isBoost ? 0.8 : (speed > 500 ? 0.3 : 0);
    const currentAlpha = this.speedLines.alpha;
    this.speedLines.setAlpha(currentAlpha + (targetAlpha - currentAlpha) * 0.1);

    if (this.speedLines.alpha <= 0) return;

    const lineCount = isBoost ? 15 : 8;
    const lineSpeed = isBoost ? speed * 1.5 : speed;

    for (let i = 0; i < lineCount; i++) {
      const y = Math.random() * GameConfig.HEIGHT;
      const length = (20 + Math.random() * 40) * (isBoost ? 1.5 : 1);
      const alpha = 0.2 + Math.random() * 0.4;

      this.speedLines.lineStyle(2, 0xFFFFFF, alpha);
      this.speedLines.beginPath();
      this.speedLines.moveTo(GameConfig.WIDTH, y);
      this.speedLines.lineTo(GameConfig.WIDTH - length, y);
      this.speedLines.stroke();
    }
  }

  setVisible(visible: boolean): void {
    this.skyLayer?.setVisible(visible);
    this.farTreesLayer?.setVisible(visible);
    this.nearBushesLayer?.setVisible(visible);
    this.groundLayer?.setVisible(visible);
    this.speedLines?.setVisible(visible);
  }

  destroy(): void {
    this.skyLayer?.destroy();
    this.farTreesLayer?.destroy();
    this.nearBushesLayer?.destroy();
    this.groundLayer?.destroy();
    this.speedLines?.destroy();
  }
}

export class GroundPhysics {
  private scene: Phaser.Scene;
  private ground: Phaser.Physics.Arcade.StaticGroup | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createGround();
  }

  private createGround(): void {
    this.ground = this.scene.physics.add.staticGroup();

    const groundRect = this.scene.add.rectangle(
      GameConfig.WIDTH / 2,
      GameConfig.GROUND_Y + 20,
      GameConfig.WIDTH * 2,
      40,
      0x000000,
      0
    );
    this.ground.add(groundRect);
    this.scene.physics.add.existing(groundRect, true);

    const body = groundRect.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(GameConfig.WIDTH * 2, 40);
    body.setOffset(-GameConfig.WIDTH, -20);
    body.updateFromGameObject();
  }

  getGroup(): Phaser.Physics.Arcade.StaticGroup {
    return this.ground!;
  }

  collideWith(sprite: Phaser.Physics.Arcade.Sprite): Phaser.Physics.Arcade.Collider {
    return this.scene.physics.add.collider(sprite, this.ground!);
  }

  destroy(): void {
    this.ground?.destroy(true);
  }
}

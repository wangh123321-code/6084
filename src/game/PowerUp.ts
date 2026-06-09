import Phaser from 'phaser';
import { PowerUpType, POWERUP_CONFIGS, GameConfig } from './GameConfig';
import { soundManager } from '../utils/SoundManager';

export class PowerUp extends Phaser.Physics.Arcade.Sprite {
  private powerUpType: PowerUpType;
  private isActive: boolean = false;
  private glowTimer: number = 0;
  private isGlowing: boolean = false;
  private collectParticles: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

  constructor(scene: Phaser.Scene, type: PowerUpType) {
    const config = POWERUP_CONFIGS[type];
    super(scene, -100, -100, `powerup_${type}`);

    this.powerUpType = type;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);
    body.setAllowGravity(false);
    body.setCircle(config.width * 0.4);

    this.setActive(false);
    this.setVisible(false);
    this.setDepth(8);
    this.createParticles();
  }

  private createParticles(): void {
    const key = `powerup_particle_${this.powerUpType}`;
    if (!this.scene.textures.exists(key)) {
      const particleCanvas = document.createElement('canvas');
      particleCanvas.width = 6;
      particleCanvas.height = 6;
      const particleCtx = particleCanvas.getContext('2d')!;
      particleCtx.fillStyle = '#FFD700';
      particleCtx.fillRect(0, 0, 6, 6);
      (this.scene.textures as any).addImage(key, particleCanvas as any);
    }

    this.collectParticles = this.scene.add.particles(0, 0, key, {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 400,
      quantity: 0,
    });
    this.collectParticles.setDepth(9);
  }

  spawn(x: number, y: number): void {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.isActive = true;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = true;

    this.scene.tweens.add({
      targets: this,
      y: y - 10,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  update(speed: number, delta: number): void {
    if (!this.isActive) return;

    this.x -= speed * (delta / 1000);

    this.glowTimer -= delta;
    if (this.glowTimer <= 0) {
      this.isGlowing = !this.isGlowing;
      this.setTexture(this.isGlowing ? `powerup_${this.powerUpType}_glow` : `powerup_${this.powerUpType}`);
      this.glowTimer = 300;
    }

    if (this.x < -100) {
      this.recycle();
    }
  }

  collect(): void {
    soundManager.playPickup();

    if (this.collectParticles) {
      this.collectParticles.emitParticleAt(this.x, this.y, 12);
    }

    this.scene.tweens.add({
      targets: this,
      scale: 1.5,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.recycle();
      },
    });
  }

  recycle(): void {
    this.isActive = false;
    this.setActive(false);
    this.setVisible(false);
    this.setAlpha(1);
    this.setScale(1);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = false;

    this.scene.tweens.killTweensOf(this);
    this.setPosition(-100, -100);
  }

  getType(): PowerUpType {
    return this.powerUpType;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  destroy(fromScene?: boolean): void {
    if (this.collectParticles) {
      this.collectParticles.destroy();
    }
    super.destroy(fromScene);
  }
}

export class PowerUpPool {
  private scene: Phaser.Scene;
  private pool: Map<PowerUpType, PowerUp[]> = new Map();
  private maxPerType: number = 5;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.initializePool();
  }

  private initializePool(): void {
    const types: PowerUpType[] = ['shoe', 'watch'];
    types.forEach(type => {
      const powerUps: PowerUp[] = [];
      for (let i = 0; i < this.maxPerType; i++) {
        powerUps.push(new PowerUp(this.scene, type));
      }
      this.pool.set(type, powerUps);
    });
  }

  getPowerUp(type: PowerUpType): PowerUp | null {
    const powerUps = this.pool.get(type);
    if (!powerUps) return null;

    const available = powerUps.find(p => !p.getIsActive());
    return available || null;
  }

  trySpawn(): PowerUp | null {
    const types: PowerUpType[] = ['shoe', 'watch'];
    const weights = [0.85, 0.15];

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
    const powerUp = this.getPowerUp(type);
    if (powerUp) {
      const config = POWERUP_CONFIGS[type];
      const y = GameConfig.GROUND_Y - 60 - Math.random() * 60;
      powerUp.spawn(GameConfig.WIDTH + 50, y);
    }
    return powerUp;
  }

  updateAll(speed: number, delta: number): void {
    this.pool.forEach(powerUps => {
      powerUps.forEach(p => p.update(speed, delta));
    });
  }

  getAllActive(): PowerUp[] {
    const active: PowerUp[] = [];
    this.pool.forEach(powerUps => {
      powerUps.forEach(p => {
        if (p.getIsActive()) active.push(p);
      });
    });
    return active;
  }

  reset(): void {
    this.pool.forEach(powerUps => {
      powerUps.forEach(p => p.recycle());
    });
  }

  destroy(): void {
    this.pool.forEach(powerUps => {
      powerUps.forEach(p => p.destroy());
    });
    this.pool.clear();
  }
}

import Phaser from 'phaser';
import { GameConfig } from './GameConfig';
import { soundManager } from '../utils/SoundManager';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private isJumping: boolean = false;
  private isInvincible: boolean = false;
  private invincibleTimer: number = 0;
  private wasOnGround: boolean = false;
  private dustParticles: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private trailTimer: number = 0;
  private trails: Phaser.GameObjects.Image[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(false);
    this.setGravityY(GameConfig.GRAVITY);
    this.setBounce(0);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(24, 36);
    body.offset.x = 4;
    body.offset.y = 8;

    this.createAnimations();
    this.createDustParticles();

    this.play('run');
  }

  private createAnimations(): void {
    if (!this.scene.anims.exists('run')) {
      this.scene.anims.create({
        key: 'run',
        frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  private createDustParticles(): void {
    if (!this.scene.textures.exists('dust_particle')) {
      const dustCanvas = document.createElement('canvas');
      dustCanvas.width = 8;
      dustCanvas.height = 8;
      const dustCtx = dustCanvas.getContext('2d')!;
      dustCtx.fillStyle = 'rgba(200, 180, 160, 0.6)';
      dustCtx.fillRect(0, 0, 8, 8);
      (this.scene.textures as any).addImage('dust_particle', dustCanvas as any);
    }

    this.dustParticles = this.scene.add.particles(0, 0, 'dust_particle', {
      speed: { min: -20, max: 20 },
      angle: { min: 180, max: 240 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 300,
      quantity: 0,
      gravityY: -50,
    });
    this.dustParticles.setDepth(11);
  }

  jump(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body.touching.down && !this.isJumping) {
      this.isJumping = true;
      this.setVelocityY(GameConfig.JUMP_FORCE);
      this.setTexture('player_jump');
      this.stopAnimation();
      soundManager.playJump();

      this.scene.tweens.add({
        targets: this,
        scaleY: 0.9,
        scaleX: 1.1,
        duration: 100,
        yoyo: true,
      });
    }
  }

  update(time: number, delta: number, speed: number, isBoost: boolean): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const onGround = body.touching.down;

    if (this.isJumping && onGround && !this.wasOnGround) {
      this.land();
    }

    if (onGround && !this.isJumping) {
      if (this.anims.currentAnim?.key !== 'run') {
        this.play('run');
      }
      const animSpeed = 8 + (speed / 100);
      this.anims.timeScale = animSpeed / 10;
    }

    if (this.isInvincible) {
      this.invincibleTimer -= delta;
      if (this.invincibleTimer <= 0) {
        this.isInvincible = false;
        this.clearTint();
        this.setAlpha(1);
      } else {
        this.setAlpha(Math.sin(time * 0.02) * 0.3 + 0.7);
      }
    }

    if (isBoost) {
      this.trailTimer -= delta;
      if (this.trailTimer <= 0) {
        this.createTrail();
        this.trailTimer = 50;
      }
    }

    this.updateTrails(delta);
    this.wasOnGround = onGround;
  }

  private createTrail(): void {
    const trail = this.scene.add.image(this.x, this.y, this.texture.key);
    trail.setAlpha(0.5);
    trail.setTint(0x4ECDC4);
    trail.setScale(this.scaleX, this.scaleY);
    this.trails.push(trail);

    this.scene.tweens.add({
      targets: trail,
      alpha: 0,
      scaleX: this.scaleX * 0.8,
      scaleY: this.scaleY * 0.8,
      duration: 200,
      onComplete: () => {
        trail.destroy();
        const index = this.trails.indexOf(trail);
        if (index > -1) {
          this.trails.splice(index, 1);
        }
      },
    });
  }

  private updateTrails(delta: number): void {
    this.trails.forEach(trail => {
      trail.x -= (GameConfig.INITIAL_SPEED + 100) * (delta / 1000);
    });
  }

  private land(): void {
    this.isJumping = false;
    this.setTexture('player');
    this.play('run');

    this.scene.cameras.main.shake(100, 0.005);
    this.scene.tweens.add({
      targets: this,
      scaleY: 0.85,
      scaleX: 1.15,
      duration: 80,
      yoyo: true,
    });

    this.spawnLandingDust();
  }

  private spawnLandingDust(): void {
    if (this.dustParticles) {
      this.dustParticles.emitParticleAt(this.x, this.y + this.height / 2 - 4, 5);
    }
  }

  takeDamage(): boolean {
    if (this.isInvincible) return false;

    this.isInvincible = true;
    this.invincibleTimer = 1500;
    this.setTint(0xFF6B6B);

    this.scene.cameras.main.shake(200, 0.02);
    soundManager.playHurt();

    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      yoyo: true,
      repeat: 5,
      duration: 100,
    });

    return true;
  }

  setInvincible(duration: number): void {
    this.isInvincible = true;
    this.invincibleTimer = duration;
  }

  getIsInvincible(): boolean {
    return this.isInvincible;
  }

  getIsJumping(): boolean {
    return this.isJumping;
  }

  playRunAnimation(): void {
    if (this.anims.currentAnim?.key !== 'run') {
      this.play('run');
    }
  }

  stopAnimation(): void {
    this.anims.stop();
  }

  destroy(fromScene?: boolean): void {
    if (this.dustParticles) {
      this.dustParticles.destroy();
    }
    this.trails.forEach(t => t.destroy());
    super.destroy(fromScene);
  }
}

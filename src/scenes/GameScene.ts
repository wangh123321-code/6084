import Phaser from 'phaser';
import { GameConfig, GameState } from '../game/GameConfig';
import { Player } from '../game/Player';
import { ObstaclePool } from '../game/Obstacle';
import { PowerUpPool, PowerUp } from '../game/PowerUp';
import { Background, GroundPhysics } from '../game/Background';
import { Storage } from '../utils/Storage';
import { soundManager } from '../utils/SoundManager';

export class GameScene extends Phaser.Scene {
  private player: Player | null = null;
  private background: Background | null = null;
  private groundPhysics: GroundPhysics | null = null;
  private obstaclePool: ObstaclePool | null = null;
  private powerUpPool: PowerUpPool | null = null;

  private gameState: GameState = {
    score: 0,
    highScore: 0,
    lives: GameConfig.INITIAL_LIVES,
    speed: GameConfig.INITIAL_SPEED,
    isBoost: false,
    isGameOver: false,
    isPaused: false,
  };

  private scoreText: Phaser.GameObjects.Text | null = null;
  private livesContainer: Phaser.GameObjects.Group | null = null;
  private boostIndicator: Phaser.GameObjects.Text | null = null;
  private boostTimer: number = 0;

  private obstacleTimer: number = 0;
  private obstacleInterval: number = GameConfig.INITIAL_OBSTACLE_INTERVAL;
  private distance: number = 0;

  private lastTime: number = 0;
  private isMuted: boolean = false;

  constructor() {
    super('GameScene');
  }

  init(data: { isMuted?: boolean }): void {
    this.isMuted = data.isMuted || false;
    soundManager.setMuted(this.isMuted);
  }

  create(): void {
    this.initializeState();
    this.createGameObjects();
    this.setupCollisions();
    this.setupInput();
    this.createHUD();

    soundManager.startBGM();

    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  private initializeState(): void {
    this.gameState = {
      score: 0,
      highScore: Storage.getHighScore(),
      lives: GameConfig.INITIAL_LIVES,
      speed: GameConfig.INITIAL_SPEED,
      isBoost: false,
      isGameOver: false,
      isPaused: false,
    };
    this.distance = 0;
    this.obstacleTimer = 0;
    this.obstacleInterval = GameConfig.INITIAL_OBSTACLE_INTERVAL;
    this.boostTimer = 0;
  }

  private createGameObjects(): void {
    this.background = new Background(this);
    this.groundPhysics = new GroundPhysics(this);

    this.player = new Player(
      this,
      GameConfig.PLAYER_X,
      GameConfig.GROUND_Y - 30
    );
    this.player.setDepth(10);

    this.groundPhysics.collideWith(this.player);

    this.obstaclePool = new ObstaclePool(this);
    this.powerUpPool = new PowerUpPool(this);
  }

  private setupCollisions(): void {
    if (!this.player || !this.obstaclePool || !this.powerUpPool) return;

    this.physics.add.overlap(
      this.player,
      this.obstaclePool.getAllActive(),
      this.handleObstacleCollision,
      this.checkCollision,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.powerUpPool.getAllActive(),
      this.handlePowerUpCollision,
      undefined,
      this
    );
  }

  private checkCollision(
    player: Player,
    obstacle: any
  ): boolean {
    if (this.gameState.isGameOver || this.gameState.isPaused) return false;
    if (player.getIsInvincible()) return false;
    return true;
  }

  private handleObstacleCollision(
    player: Player,
    obstacle: any
  ): void {
    if (!player.takeDamage()) return;

    this.gameState.lives--;
    this.updateLivesDisplay();

    if (this.gameState.lives <= 0) {
      this.gameOver();
    } else {
      player.setInvincible(1500);
    }
  }

  private handlePowerUpCollision(
    player: Player,
    powerUp: PowerUp
  ): void {
    powerUp.collect();

    const type = powerUp.getType();
    if (type === 'shoe') {
      this.activateBoost();
    } else if (type === 'watch') {
      this.addLife();
    }
  }

  private activateBoost(): void {
    this.gameState.isBoost = true;
    this.boostTimer = GameConfig.POWERUP_SHOE_DURATION;
    this.showBoostIndicator(true);
  }

  private addLife(): void {
    if (this.gameState.lives < 5) {
      this.gameState.lives++;
      this.updateLivesDisplay();
    }
  }

  private setupInput(): void {
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.handleJump();
    });

    this.input.on('pointerdown', () => {
      this.handleJump();
    });

    this.input.addPointer(2);
  }

  private handleJump(): void {
    if (this.gameState.isGameOver || this.gameState.isPaused) return;
    this.player?.jump();
  }

  private createHUD(): void {
    this.scoreText = this.add.text(20, 20, '0m', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#FFFFFF',
    }).setOrigin(0, 0);
    this.scoreText.setStroke('#000000', 4);
    this.scoreText.setDepth(100);

    this.livesContainer = this.add.group();
    this.updateLivesDisplay();

    this.boostIndicator = this.add.text(
      GameConfig.WIDTH / 2,
      30,
      '⚡ 加速中!',
      {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#FFD700',
      }
    ).setOrigin(0.5);
    this.boostIndicator.setStroke('#000000', 3);
    this.boostIndicator.setDepth(100);
    this.boostIndicator.setVisible(false);
  }

  private updateLivesDisplay(): void {
    if (!this.livesContainer) return;

    this.livesContainer.clear(true);

    for (let i = 0; i < 5; i++) {
      const x = GameConfig.WIDTH - 30 - i * 35;
      const texture = i < this.gameState.lives ? 'heart' : 'heart_empty';
      const heart = this.add.image(x, 30, texture);
      heart.setScale(0.8);
      heart.setDepth(100);
      this.livesContainer.add(heart);
    }
  }

  private showBoostIndicator(show: boolean): void {
    if (!this.boostIndicator) return;
    this.boostIndicator.setVisible(show);

    if (show) {
      this.tweens.add({
        targets: this.boostIndicator,
        scale: 1.2,
        duration: 200,
        yoyo: true,
        repeat: -1,
      });
    } else {
      this.tweens.killTweensOf(this.boostIndicator);
      this.boostIndicator.setScale(1);
    }
  }

  update(time: number, delta: number): void {
    if (this.gameState.isGameOver || this.gameState.isPaused) return;

    if (this.lastTime === 0) {
      this.lastTime = time;
    }

    const actualDelta = Math.min(delta, 50);

    this.updateGameSpeed(actualDelta);
    this.updateDistance(actualDelta);
    this.updateObstacleSpawn(actualDelta);
    this.updatePowerUpSpawn();
    this.updateBoost(actualDelta);

    this.background?.update(this.gameState.speed, actualDelta, this.gameState.isBoost);
    this.obstaclePool?.updateAll(this.gameState.speed, actualDelta);
    this.powerUpPool?.updateAll(this.gameState.speed, actualDelta);
    this.player?.update(time, actualDelta, this.gameState.speed, this.gameState.isBoost);

    this.updateCollisions();
    this.updateScoreDisplay();
    this.updateDifficulty();

    this.lastTime = time;
  }

  private updateGameSpeed(delta: number): void {
    const speedIncrement = this.gameState.isBoost
      ? GameConfig.SPEED_INCREMENT * 2
      : GameConfig.SPEED_INCREMENT;

    const targetSpeed = Math.min(
      GameConfig.INITIAL_SPEED + (this.distance / 10) * speedIncrement,
      this.gameState.isBoost ? GameConfig.MAX_SPEED * 1.5 : GameConfig.MAX_SPEED
    );

    this.gameState.speed += (targetSpeed - this.gameState.speed) * 0.01;
  }

  private updateDistance(delta: number): void {
    this.distance += (this.gameState.speed * delta) / 1000;
    this.gameState.score = Math.floor(this.distance);
  }

  private updateObstacleSpawn(delta: number): void {
    this.obstacleTimer += delta;

    if (this.obstacleTimer >= this.obstacleInterval) {
      this.obstaclePool?.spawnRandom();
      this.obstacleTimer = 0;
    }
  }

  private updatePowerUpSpawn(): void {
    this.powerUpPool?.trySpawn();
  }

  private updateBoost(delta: number): void {
    if (this.gameState.isBoost) {
      this.boostTimer -= delta;
      if (this.boostTimer <= 0) {
        this.gameState.isBoost = false;
        this.showBoostIndicator(false);
      }
    }
  }

  private updateCollisions(): void {
    if (!this.player || !this.obstaclePool || !this.powerUpPool) return;

    const obstacles = this.obstaclePool.getAllActive();
    obstacles.forEach(obstacle => {
      if (this.physics.overlap(this.player!, obstacle)) {
        this.handleObstacleCollision(this.player!, obstacle);
      }
    });

    const powerUps = this.powerUpPool.getAllActive();
    powerUps.forEach(powerUp => {
      if (this.physics.overlap(this.player!, powerUp)) {
        this.handlePowerUpCollision(this.player!, powerUp);
      }
    });
  }

  private updateScoreDisplay(): void {
    if (!this.scoreText) return;
    this.scoreText.setText(`${this.gameState.score}m`);
  }

  private updateDifficulty(): void {
    const progress = Math.min(this.distance / 1000, 1);
    this.obstacleInterval =
      GameConfig.INITIAL_OBSTACLE_INTERVAL -
      progress * (GameConfig.INITIAL_OBSTACLE_INTERVAL - GameConfig.MIN_OBSTACLE_INTERVAL);
  }

  private gameOver(): void {
    this.gameState.isGameOver = true;
    this.player?.stopAnimation();
    soundManager.stopBGM();
    soundManager.playGameOver();

    const isNewHighScore = Storage.isNewHighScore(this.gameState.score);
    if (isNewHighScore) {
      Storage.setHighScore(this.gameState.score);
      this.gameState.highScore = this.gameState.score;
    }

    this.cameras.main.flash(300, 255, 0, 0);
    this.cameras.main.shake(500, 0.01);

    this.time.delayedCall(1000, () => {
      this.scene.start('GameOverScene', {
        score: this.gameState.score,
        highScore: this.gameState.highScore,
        isNewHighScore,
        isMuted: this.isMuted,
      });
    });
  }

  destroy(fromScene?: boolean): void {
    soundManager.stopBGM();
    this.background?.destroy();
    this.groundPhysics?.destroy();
    this.obstaclePool?.destroy();
    this.powerUpPool?.destroy();
    this.player?.destroy();
    // @ts-ignore - Phaser Scene has destroy method but types are incorrect
    super.destroy(fromScene);
  }
}

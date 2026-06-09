import Phaser from 'phaser';
import { GameConfig, COLORS } from '../game/GameConfig';
import { soundManager } from '../utils/SoundManager';
import { ChallengeDef } from '../utils/ChallengeManager';

interface GameOverData {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  isMuted: boolean;
  challengeDefs?: ChallengeDef[];
}

export class GameOverScene extends Phaser.Scene {
  private score: number = 0;
  private highScore: number = 0;
  private isNewHighScore: boolean = false;
  private isMuted: boolean = false;
  private challengeDefs: ChallengeDef[] = [];
  private restartButton: Phaser.GameObjects.Text | null = null;
  private menuButton: Phaser.GameObjects.Text | null = null;

  constructor() {
    super('GameOverScene');
  }

  init(data: GameOverData): void {
    this.score = data.score;
    this.highScore = data.highScore;
    this.isNewHighScore = data.isNewHighScore;
    this.isMuted = data.isMuted;
    this.challengeDefs = data.challengeDefs || [];
    soundManager.setMuted(this.isMuted);
  }

  create(): void {
    this.createBackground();
    this.createGameOverText();
    this.createScoreDisplay();
    this.createChallengeResult();
    this.createButtons();
    this.setupInput();

    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  private createBackground(): void {
    this.add.rectangle(
      GameConfig.WIDTH / 2,
      GameConfig.HEIGHT / 2,
      GameConfig.WIDTH,
      GameConfig.HEIGHT,
      0x000000,
      0.85
    );

    this.add.tileSprite(0, 0, GameConfig.WIDTH, 300, 'bg_sky').setOrigin(0, 0).setAlpha(0.3);
    this.add.tileSprite(0, GameConfig.GROUND_Y - 200, GameConfig.WIDTH, 200, 'bg_far_trees').setOrigin(0, 0).setAlpha(0.3);
    this.add.tileSprite(0, GameConfig.GROUND_Y - 100, GameConfig.WIDTH, 100, 'bg_near_bushes').setOrigin(0, 0).setAlpha(0.3);
    this.add.tileSprite(0, GameConfig.GROUND_Y, GameConfig.WIDTH, 80, 'ground').setOrigin(0, 0).setAlpha(0.3);
  }

  private createGameOverText(): void {
    const gameOverText = this.add.text(
      GameConfig.WIDTH / 2,
      80,
      '游戏结束',
      {
        fontFamily: 'monospace',
        fontSize: '48px',
        color: '#FF6B6B',
        fontStyle: 'bold',
      }
    ).setOrigin(0.5);
    gameOverText.setStroke('#000000', 6);

    this.tweens.add({
      targets: gameOverText,
      scale: 1.1,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    if (this.isNewHighScore) {
      const newRecordText = this.add.text(
        GameConfig.WIDTH / 2,
        140,
        '🎉 新纪录!',
        {
          fontFamily: 'monospace',
          fontSize: '28px',
          color: '#FFD700',
        }
      ).setOrigin(0.5);
      newRecordText.setStroke('#000000', 4);

      this.tweens.add({
        targets: newRecordText,
        y: 135,
        duration: 300,
        yoyo: true,
        repeat: -1,
      });

      for (let i = 0; i < 20; i++) {
        this.time.delayedCall(i * 50, () => {
          this.spawnConfetti();
        });
      }
    }
  }

  private spawnConfetti(): void {
    const colors = [0xFF6B6B, 0x4ECDC4, 0xFFD700, 0x9B59B6, 0x90EE90];
    const x = Math.random() * GameConfig.WIDTH;
    const color = colors[Math.floor(Math.random() * colors.length)];

    const confetti = this.add.rectangle(x, -20, 8, 8, color);
    confetti.setDepth(100);

    this.tweens.add({
      targets: confetti,
      y: GameConfig.HEIGHT + 20,
      x: x + (Math.random() - 0.5) * 200,
      angle: Math.random() * 720 - 360,
      duration: 2000 + Math.random() * 1000,
      ease: 'Quad.easeIn',
      onComplete: () => confetti.destroy(),
    });
  }

  private createScoreDisplay(): void {
    const panel = this.add.graphics();
    panel.fillStyle(0x2C3E50, 0.9);
    panel.lineStyle(4, 0xFFFFFF, 1);
    panel.fillRoundedRect(GameConfig.WIDTH / 2 - 180, 170, 360, 150, 16);
    panel.strokeRoundedRect(GameConfig.WIDTH / 2 - 180, 170, 360, 150, 16);

    const distanceLabel = this.add.text(
      GameConfig.WIDTH / 2,
      210,
      '本次距离',
      {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#AAAAAA',
      }
    ).setOrigin(0.5);

    const distanceValue = this.add.text(
      GameConfig.WIDTH / 2,
      245,
      `${this.score}m`,
      {
        fontFamily: 'monospace',
        fontSize: '36px',
        color: '#FFFFFF',
        fontStyle: 'bold',
      }
    ).setOrigin(0.5);
    distanceValue.setStroke('#000000', 3);

    const highScoreLabel = this.add.text(
      GameConfig.WIDTH / 2,
      290,
      `最高纪录: ${this.highScore}m`,
      {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#FFD700',
      }
    ).setOrigin(0.5);
    highScoreLabel.setStroke('#000000', 2);
  }

  private createChallengeResult(): void {
    if (this.challengeDefs.length === 0) return;

    const panelY = 335;
    const panelHeight = 30 + this.challengeDefs.length * 22;
    const panelWidth = 360;
    const panelX = GameConfig.WIDTH / 2 - panelWidth / 2;

    const panel = this.add.graphics();
    panel.fillStyle(0x1A1A2E, 0.85);
    panel.lineStyle(2, 0xFFD700, 0.8);
    panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 10);
    panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 10);

    const title = this.add.text(GameConfig.WIDTH / 2, panelY + 12, '📋 今日挑战完成', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0);

    this.challengeDefs.forEach((def, i) => {
      const y = panelY + 30 + i * 22;
      this.add.text(panelX + 15, y, `${def.icon} ${def.name}`, {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: def.color,
        fontStyle: 'bold',
      });
      this.add.text(panelX + 130, y, def.description, {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#CCCCCC',
      });
      this.add.text(panelX + panelWidth - 30, y, '✅', {
        fontSize: '12px',
      });
    });
  }

  private createButtons(): void {
    this.restartButton = this.add.text(
      GameConfig.WIDTH / 2,
      this.challengeDefs.length > 0 ? 410 : 370,
      '再来一次',
      {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#FFFFFF',
        backgroundColor: '#4ECDC4',
        padding: { x: 30, y: 12 },
      }
    ).setOrigin(0.5);
    this.restartButton.setStroke('#000000', 4);
    this.restartButton.setInteractive({ useHandCursor: true });

    this.setupButtonEvents(this.restartButton, () => this.restartGame());

    this.menuButton = this.add.text(
      GameConfig.WIDTH / 2,
      this.challengeDefs.length > 0 ? 450 : 420,
      '返回菜单',
      {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#FFFFFF',
        backgroundColor: '#666666',
        padding: { x: 25, y: 8 },
      }
    ).setOrigin(0.5);
    this.menuButton.setStroke('#000000', 3);
    this.menuButton.setInteractive({ useHandCursor: true });

    this.setupButtonEvents(this.menuButton, () => this.goToMenu());
  }

  private setupButtonEvents(
    button: Phaser.GameObjects.Text,
    onClick: () => void
  ): void {
    const originalScale = button.scale;

    button.on('pointerover', () => {
      this.tweens.add({
        targets: button,
        scale: originalScale * 1.1,
        duration: 150,
      });
    });

    button.on('pointerout', () => {
      this.tweens.add({
        targets: button,
        scale: originalScale,
        duration: 150,
      });
    });

    button.on('pointerdown', () => {
      onClick();
    });
  }

  private setupInput(): void {
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.restartGame();
    });

    this.input.keyboard?.on('keydown-ENTER', () => {
      this.restartGame();
    });

    this.input.keyboard?.on('keydown-ESC', () => {
      this.goToMenu();
    });
  }

  private restartGame(): void {
    if (this.gameState.isTransitioning) return;
    this.gameState.isTransitioning = true;

    this.cameras.main.fadeOut(300, 0, 0, 0);

    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene', { isMuted: this.isMuted });
    });
  }

  private goToMenu(): void {
    if (this.gameState.isTransitioning) return;
    this.gameState.isTransitioning = true;

    this.cameras.main.fadeOut(300, 0, 0, 0);

    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('StartScene');
    });
  }

  private gameState = {
    isTransitioning: false,
  };
}

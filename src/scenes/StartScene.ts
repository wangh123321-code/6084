import Phaser from 'phaser';
import { GameConfig, COLORS } from '../game/GameConfig';
import { Storage } from '../utils/Storage';
import { soundManager } from '../utils/SoundManager';
import { ChallengeManager } from '../utils/ChallengeManager';

export class StartScene extends Phaser.Scene {
  private titleText: Phaser.GameObjects.Text | null = null;
  private startButton: Phaser.GameObjects.Text | null = null;
  private highScoreText: Phaser.GameObjects.Text | null = null;
  private playerPreview: Phaser.GameObjects.Image | null = null;
  private isMuted: boolean = false;
  private muteButton: Phaser.GameObjects.Text | null = null;

  constructor() {
    super('StartScene');
  }

  create(): void {
    this.createBackground();
    this.createTitle();
    this.createPlayerPreview();
    this.createDailyChallenge();
    this.createHighScore();
    this.createStartButton();
    this.createControlsHint();
    this.createMuteButton();
    this.setupInput();

    this.sound.volume = 0.3;
  }

  private createBackground(): void {
    this.add.tileSprite(0, 0, GameConfig.WIDTH, 300, 'bg_sky').setOrigin(0, 0);
    this.add.tileSprite(0, GameConfig.GROUND_Y - 200, GameConfig.WIDTH, 200, 'bg_far_trees').setOrigin(0, 0);
    this.add.tileSprite(0, GameConfig.GROUND_Y - 100, GameConfig.WIDTH, 100, 'bg_near_bushes').setOrigin(0, 0);
    this.add.tileSprite(0, GameConfig.GROUND_Y, GameConfig.WIDTH, 80, 'ground').setOrigin(0, 0);
  }

  private createTitle(): void {
    this.titleText = this.add.text(GameConfig.WIDTH / 2, 80, '像素晨跑', {
      fontFamily: 'monospace',
      fontSize: '48px',
      color: '#FFFFFF',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.titleText.setStroke('#000000', 6);
    this.titleText.setShadow(4, 4, '#000000', 0, true, false);

    this.tweens.add({
      targets: this.titleText,
      y: 75,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    const subtitle = this.add.text(GameConfig.WIDTH / 2, 130, 'PARKOUR RUNNER', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#FFD700',
    }).setOrigin(0.5);
    subtitle.setStroke('#000000', 3);
  }

  private createPlayerPreview(): void {
    this.playerPreview = this.add.sprite(GameConfig.WIDTH / 2, 200, 'player');
    this.playerPreview.setScale(2.5);

    if (!this.anims.exists('preview_run')) {
      this.anims.create({
        key: 'preview_run',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1,
      });
    }

    (this.playerPreview as any).play('preview_run');
  }

  private createDailyChallenge(): void {
    const activeDefs = ChallengeManager.getActiveDefs();

    const panelX = GameConfig.WIDTH / 2;
    const panelY = 275;

    const panel = this.add.graphics();
    panel.fillStyle(0x1A1A2E, 0.85);
    panel.lineStyle(2, 0xFFD700, 0.8);
    const panelWidth = 360;
    const panelHeight = activeDefs.length > 0 ? 55 + activeDefs.length * 22 : 45;
    panel.fillRoundedRect(panelX - panelWidth / 2, panelY - panelHeight / 2, panelWidth, panelHeight, 10);
    panel.strokeRoundedRect(panelX - panelWidth / 2, panelY - panelHeight / 2, panelWidth, panelHeight, 10);

    const label = this.add.text(panelX, panelY - panelHeight / 2 + 12, '📋 每日挑战', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0);

    activeDefs.forEach((def, i) => {
      const y = panelY - panelHeight / 2 + 30 + i * 22;
      const icon = this.add.text(panelX - panelWidth / 2 + 20, y, def.icon, {
        fontSize: '14px',
      });
      const name = this.add.text(panelX - panelWidth / 2 + 42, y, def.name, {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: def.color,
        fontStyle: 'bold',
      });
      const desc = this.add.text(panelX - panelWidth / 2 + 110, y, def.description, {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#CCCCCC',
      });
    });

    if (activeDefs.length === 0) {
      const noChallenge = this.add.text(panelX, panelY, '今日无特殊挑战', {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#888888',
      }).setOrigin(0.5);
    }
  }

  private createHighScore(): void {
    const highScore = Storage.getHighScore();

    this.highScoreText = this.add.text(GameConfig.WIDTH / 2, 330, '', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#FFD700',
    }).setOrigin(0.5);

    this.updateHighScoreDisplay(highScore);
  }

  private updateHighScoreDisplay(score: number): void {
    if (!this.highScoreText) return;
    if (score > 0) {
      this.highScoreText.setText(`🏆 最高纪录: ${score}m`);
    } else {
      this.highScoreText.setText('快来创造你的第一个纪录!');
    }
    this.highScoreText.setStroke('#000000', 3);
  }

  private createStartButton(): void {
    this.startButton = this.add.text(GameConfig.WIDTH / 2, 375, '开始游戏', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#FFFFFF',
      backgroundColor: '#4ECDC4',
      padding: { x: 30, y: 15 },
    }).setOrigin(0.5);

    this.startButton.setStroke('#000000', 4);
    this.startButton.setInteractive({ useHandCursor: true });

    const originalScale = this.startButton.scale;

    this.startButton.on('pointerover', () => {
      this.tweens.add({
        targets: this.startButton,
        scale: originalScale * 1.1,
        duration: 150,
      });
    });

    this.startButton.on('pointerout', () => {
      this.tweens.add({
        targets: this.startButton,
        scale: originalScale,
        duration: 150,
      });
    });

    this.startButton.on('pointerdown', () => {
      this.startGame();
    });
  }

  private createControlsHint(): void {
    const hint = this.add.text(GameConfig.WIDTH / 2, 430, '按 空格键 或 点击屏幕 跳跃', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#FFFFFF',
    }).setOrigin(0.5);
    hint.setStroke('#000000', 2);

    this.tweens.add({
      targets: hint,
      alpha: 0.5,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
  }

  private createMuteButton(): void {
    this.muteButton = this.add.text(GameConfig.WIDTH - 30, 30, '🔊', {
      fontSize: '24px',
    }).setOrigin(1, 0);
    this.muteButton.setInteractive({ useHandCursor: true });

    this.muteButton.on('pointerdown', () => {
      this.toggleMute();
    });
  }

  private toggleMute(): void {
    this.isMuted = !this.isMuted;
    soundManager.setMuted(this.isMuted);
    if (this.muteButton) {
      this.muteButton.setText(this.isMuted ? '🔇' : '🔊');
    }
  }

  private setupInput(): void {
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.startGame();
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.x > GameConfig.WIDTH - 60 && pointer.y < 60) {
        return;
      }
      this.startGame();
    });
  }

  private startGame(): void {
    this.cameras.main.fadeOut(300, 0, 0, 0);

    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene', { isMuted: this.isMuted });
    });
  }
}

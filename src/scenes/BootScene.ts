import Phaser from 'phaser';
import { PixelArt } from '../utils/PixelArt';

export class BootScene extends Phaser.Scene {
  private loadingText: Phaser.GameObjects.Text | null = null;
  private progressBar: Phaser.GameObjects.Graphics | null = null;

  constructor() {
    super('BootScene');
  }

  create(): void {
    this.createLoadingUI();
    this.generateAssets();
  }

  private createLoadingUI(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.rectangle(width / 2, height / 2, width, height, 0x87CEEB);

    this.loadingText = this.add.text(width / 2, height / 2 - 30, '加载中...', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#FFFFFF',
    }).setOrigin(0.5);

    this.progressBar = this.add.graphics();
    this.updateProgressBar(0);
  }

  private updateProgressBar(value: number): void {
    if (!this.progressBar) return;

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const barWidth = 300;
    const barHeight = 20;
    const x = (width - barWidth) / 2;
    const y = height / 2;

    this.progressBar.clear();

    this.progressBar.fillStyle(0x333333);
    this.progressBar.fillRect(x, y, barWidth, barHeight);

    this.progressBar.fillStyle(0x4ECDC4);
    this.progressBar.fillRect(x, y, barWidth * value, barHeight);

    this.progressBar.lineStyle(2, 0xFFFFFF);
    this.progressBar.strokeRect(x, y, barWidth, barHeight);
  }

  private generateAssets(): void {
    try {
      this.updateProgressBar(0.3);
      PixelArt.generateAll(this);
      this.updateProgressBar(1);
      this.loadingText?.setText('准备就绪!');
      
      this.time.delayedCall(500, () => {
        this.scene.start('StartScene');
      });
    } catch (error) {
      console.error('生成资源失败:', error);
      this.loadingText?.setText('加载失败! 请刷新页面');
    }
  }
}

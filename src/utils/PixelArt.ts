import Phaser from 'phaser';
import { COLORS, GameConfig, ObstacleType, PowerUpType, OBSTACLE_CONFIGS, POWERUP_CONFIGS } from '../game/GameConfig';

const PIXEL = GameConfig.PIXEL_SIZE;

export class PixelArt {
  private static hexToRgb(hex: number): string {
    const r = (hex >> 16) & 255;
    const g = (hex >> 8) & 255;
    const b = hex & 255;
    return `rgb(${r},${g},${b})`;
  }

  private static drawPixel(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: number,
    size: number = PIXEL
  ): void {
    ctx.fillStyle = this.hexToRgb(color);
    ctx.fillRect(x * size, y * size, size, size);
  }

  private static drawPixels(
    ctx: CanvasRenderingContext2D,
    pixels: Array<{ x: number; y: number; c: number }>,
    offsetX: number = 0,
    offsetY: number = 0,
    pixelSize: number = PIXEL
  ): void {
    pixels.forEach(({ x, y, c }) => {
      this.drawPixel(ctx, x + offsetX, y + offsetY, c, pixelSize);
    });
  }

  static generatePlayer(scene: Phaser.Scene): void {
    const frameWidth = 16 * PIXEL;
    const frameHeight = 22 * PIXEL;
    const canvas = document.createElement('canvas');
    canvas.width = frameWidth * 4;
    canvas.height = frameHeight;
    const ctx = canvas.getContext('2d')!;

    const skin = 0xFFDAB9;
    const hair = 0x4A3728;
    const hat = 0xE74C3C;
    const shirt = 0x3498DB;
    const pants = 0x2C3E50;
    const shoe = 0x2C3E50;
    const outline = 0x000000;

    const drawRunner = (frameOffset: number, legLeftY: number, legRightY: number, armLeftY: number, armRightY: number) => {
      const ox = frameOffset * 16;

      // Hat
      const hatPixels = [
        { x: 4, y: 1, c: hat }, { x: 5, y: 1, c: hat }, { x: 6, y: 1, c: hat }, { x: 7, y: 1, c: hat }, { x: 8, y: 1, c: hat }, { x: 9, y: 1, c: hat }, { x: 10, y: 1, c: hat },
        { x: 3, y: 2, c: hat }, { x: 4, y: 2, c: hat }, { x: 5, y: 2, c: hat }, { x: 6, y: 2, c: hat }, { x: 7, y: 2, c: hat }, { x: 8, y: 2, c: hat }, { x: 9, y: 2, c: hat }, { x: 10, y: 2, c: hat }, { x: 11, y: 2, c: hat },
        { x: 2, y: 3, c: hat }, { x: 3, y: 3, c: hat }, { x: 4, y: 3, c: hat }, { x: 5, y: 3, c: hat }, { x: 6, y: 3, c: hat }, { x: 7, y: 3, c: hat }, { x: 8, y: 3, c: hat }, { x: 9, y: 3, c: hat }, { x: 10, y: 3, c: hat }, { x: 11, y: 3, c: hat }, { x: 12, y: 3, c: hat },
        { x: 1, y: 4, c: outline }, { x: 2, y: 4, c: hat }, { x: 3, y: 4, c: hat }, { x: 4, y: 4, c: hat }, { x: 5, y: 4, c: hat }, { x: 6, y: 4, c: hat }, { x: 7, y: 4, c: hat }, { x: 8, y: 4, c: hat }, { x: 9, y: 4, c: hat }, { x: 10, y: 4, c: hat }, { x: 11, y: 4, c: hat }, { x: 12, y: 4, c: hat }, { x: 13, y: 4, c: outline },
      ];
      this.drawPixels(ctx, hatPixels, ox, 0);

      // Head
      const headPixels = [
        { x: 4, y: 5, c: outline }, { x: 5, y: 5, c: skin }, { x: 6, y: 5, c: skin }, { x: 7, y: 5, c: skin }, { x: 8, y: 5, c: skin }, { x: 9, y: 5, c: skin }, { x: 10, y: 5, c: outline },
        { x: 4, y: 6, c: skin }, { x: 5, y: 6, c: skin }, { x: 6, y: 6, c: hair }, { x: 7, y: 6, c: skin }, { x: 8, y: 6, c: skin }, { x: 9, y: 6, c: hair }, { x: 10, y: 6, c: skin },
        { x: 4, y: 7, c: skin }, { x: 5, y: 7, c: skin }, { x: 6, y: 7, c: skin }, { x: 7, y: 7, c: outline }, { x: 8, y: 7, c: outline }, { x: 9, y: 7, c: skin }, { x: 10, y: 7, c: skin },
        { x: 4, y: 8, c: outline }, { x: 5, y: 8, c: skin }, { x: 6, y: 8, c: skin }, { x: 7, y: 8, c: skin }, { x: 8, y: 8, c: skin }, { x: 9, y: 8, c: skin }, { x: 10, y: 8, c: outline },
      ];
      this.drawPixels(ctx, headPixels, ox, 0);

      // Body/Shirt
      const bodyPixels = [
        { x: 4, y: 9, c: outline }, { x: 5, y: 9, c: shirt }, { x: 6, y: 9, c: shirt }, { x: 7, y: 9, c: shirt }, { x: 8, y: 9, c: shirt }, { x: 9, y: 9, c: shirt }, { x: 10, y: 9, c: outline },
        { x: 3, y: 10, c: outline }, { x: 4, y: 10, c: shirt }, { x: 5, y: 10, c: shirt }, { x: 6, y: 10, c: shirt }, { x: 7, y: 10, c: shirt }, { x: 8, y: 10, c: shirt }, { x: 9, y: 10, c: shirt }, { x: 10, y: 10, c: shirt }, { x: 11, y: 10, c: outline },
        { x: 3, y: 11, c: outline }, { x: 4, y: 11, c: shirt }, { x: 5, y: 11, c: shirt }, { x: 6, y: 11, c: shirt }, { x: 7, y: 11, c: shirt }, { x: 8, y: 11, c: shirt }, { x: 9, y: 11, c: shirt }, { x: 10, y: 11, c: shirt }, { x: 11, y: 11, c: outline },
        { x: 3, y: 12, c: outline }, { x: 4, y: 12, c: shirt }, { x: 5, y: 12, c: shirt }, { x: 6, y: 12, c: shirt }, { x: 7, y: 12, c: shirt }, { x: 8, y: 12, c: shirt }, { x: 9, y: 12, c: shirt }, { x: 10, y: 12, c: shirt }, { x: 11, y: 12, c: outline },
        { x: 4, y: 13, c: outline }, { x: 5, y: 13, c: shirt }, { x: 6, y: 13, c: shirt }, { x: 7, y: 13, c: shirt }, { x: 8, y: 13, c: shirt }, { x: 9, y: 13, c: shirt }, { x: 10, y: 13, c: outline },
      ];
      this.drawPixels(ctx, bodyPixels, ox, 0);

      // Arms
      const leftArm = [
        { x: 2, y: armLeftY, c: outline }, { x: 3, y: armLeftY, c: skin },
        { x: 2, y: armLeftY + 1, c: outline }, { x: 3, y: armLeftY + 1, c: skin },
        { x: 2, y: armLeftY + 2, c: outline }, { x: 3, y: armLeftY + 2, c: skin },
      ];
      const rightArm = [
        { x: 11, y: armRightY, c: skin }, { x: 12, y: armRightY, c: outline },
        { x: 11, y: armRightY + 1, c: skin }, { x: 12, y: armRightY + 1, c: outline },
        { x: 11, y: armRightY + 2, c: skin }, { x: 12, y: armRightY + 2, c: outline },
      ];
      this.drawPixels(ctx, leftArm, ox, 0);
      this.drawPixels(ctx, rightArm, ox, 0);

      // Pants
      const pantsPixels = [
        { x: 5, y: 14, c: outline }, { x: 6, y: 14, c: pants }, { x: 7, y: 14, c: pants }, { x: 8, y: 14, c: pants }, { x: 9, y: 14, c: outline },
        { x: 5, y: 15, c: outline }, { x: 6, y: 15, c: pants }, { x: 7, y: 15, c: pants }, { x: 8, y: 15, c: pants }, { x: 9, y: 15, c: outline },
      ];
      this.drawPixels(ctx, pantsPixels, ox, 0);

      // Legs
      const leftLeg = [
        { x: 5, y: legLeftY, c: outline }, { x: 6, y: legLeftY, c: pants },
        { x: 5, y: legLeftY + 1, c: outline }, { x: 6, y: legLeftY + 1, c: pants },
        { x: 5, y: legLeftY + 2, c: outline }, { x: 6, y: legLeftY + 2, c: pants },
        { x: 4, y: legLeftY + 3, c: outline }, { x: 5, y: legLeftY + 3, c: shoe }, { x: 6, y: legLeftY + 3, c: shoe }, { x: 7, y: legLeftY + 3, c: outline },
      ];
      const rightLeg = [
        { x: 8, y: legRightY, c: pants }, { x: 9, y: legRightY, c: outline },
        { x: 8, y: legRightY + 1, c: pants }, { x: 9, y: legRightY + 1, c: outline },
        { x: 8, y: legRightY + 2, c: pants }, { x: 9, y: legRightY + 2, c: outline },
        { x: 8, y: legRightY + 3, c: outline }, { x: 9, y: legRightY + 3, c: shoe }, { x: 10, y: legRightY + 3, c: shoe }, { x: 11, y: legRightY + 3, c: outline },
      ];
      this.drawPixels(ctx, leftLeg, ox, 0);
      this.drawPixels(ctx, rightLeg, ox, 0);
    };

    // Frame 0: Stand/Run start
    drawRunner(0, 16, 16, 10, 10);
    // Frame 1: Left leg forward
    drawRunner(1, 17, 16, 10, 11);
    // Frame 2: Both down
    drawRunner(2, 16, 16, 11, 11);
    // Frame 3: Right leg forward
    drawRunner(3, 16, 17, 11, 10);

    (scene.textures as any).addSpriteSheet('player', canvas as any, {
      frameWidth: frameWidth,
      frameHeight: frameHeight,
    });

    // Jump frame
    const jumpCanvas = document.createElement('canvas');
    jumpCanvas.width = frameWidth;
    jumpCanvas.height = frameHeight;
    const jumpCtx = jumpCanvas.getContext('2d')!;
    drawRunner(0, 15, 15, 9, 9);
    // Add jumping effect - raise arms higher
    this.drawPixels(jumpCtx, [
      { x: 2, y: 8, c: outline }, { x: 3, y: 8, c: skin },
      { x: 2, y: 9, c: outline }, { x: 3, y: 9, c: skin },
      { x: 11, y: 8, c: skin }, { x: 12, y: 8, c: outline },
      { x: 11, y: 9, c: skin }, { x: 12, y: 9, c: outline },
    ], 0, 0);
    (scene.textures as any).addImage('player_jump', jumpCanvas as any);
  }

  static generateObstacle(scene: Phaser.Scene, type: ObstacleType): void {
    const config = OBSTACLE_CONFIGS[type];
    const width = config.width;
    const height = config.height;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    if (type === 'bottle') {
      // Water bottle
      const bottle = 0x87CEEB;
      const cap = 0xE74C3C;
      const label = 0xFFFFFF;
      const outline = 0x000000;

      for (let y = 0; y < 4; y++) {
        for (let x = 5; x < 15; x++) {
          if (x === 5 || x === 14 || y === 0 || y === 3) {
            this.drawPixel(ctx, x, y, outline, 1);
          } else {
            this.drawPixel(ctx, x, y, cap, 1);
          }
        }
      }
      for (let y = 4; y < 32; y++) {
        for (let x = 2; x < 18; x++) {
          if (x === 2 || x === 17 || y === 31) {
            this.drawPixel(ctx, x, y, outline, 1);
          } else if (y >= 18 && y <= 24 && x >= 4 && x <= 15) {
            this.drawPixel(ctx, x, y, label, 1);
          } else {
            this.drawPixel(ctx, x, y, bottle, 1);
          }
        }
      }
    } else if (type === 'fence') {
      // Fence
      const wood = 0x8B4513;
      const darkWood = 0x654321;
      const outline = 0x000000;

      // Posts
      for (let px = 0; px < 48; px += 12) {
        for (let y = 0; y < 40; y++) {
          for (let x = px; x < px + 8; x++) {
            if (x === px || x === px + 7 || y === 0 || y === 39) {
              this.drawPixel(ctx, x, y, outline, 1);
            } else if (y < 3 || (y >= 15 && y < 18) || (y >= 28 && y < 31)) {
              this.drawPixel(ctx, x, y, darkWood, 1);
            } else {
              this.drawPixel(ctx, x, y, wood, 1);
            }
          }
        }
      }
      // Horizontal rails
      for (let railY of [12, 25]) {
        for (let x = 0; x < 48; x++) {
          for (let y = railY; y < railY + 6; y++) {
            if (y === railY || y === railY + 5) {
              this.drawPixel(ctx, x, y, outline, 1);
            } else {
              this.drawPixel(ctx, x, y, darkWood, 1);
            }
          }
        }
      }
    } else if (type === 'dog') {
      // Dog
      const fur = 0xD2691E;
      const darkFur = 0x8B4513;
      const ear = 0x654321;
      const eye = 0x000000;
      const tongue = 0xFF69B4;
      const outline = 0x000000;

      // Head
      const headPixels = [
        { x: 5, y: 2, c: outline }, { x: 6, y: 2, c: fur }, { x: 7, y: 2, c: fur }, { x: 8, y: 2, c: fur },
        { x: 4, y: 3, c: outline }, { x: 5, y: 3, c: fur }, { x: 6, y: 3, c: fur }, { x: 7, y: 3, c: fur }, { x: 8, y: 3, c: fur }, { x: 9, y: 3, c: outline },
        { x: 3, y: 4, c: ear }, { x: 4, y: 4, c: fur }, { x: 5, y: 4, c: fur }, { x: 6, y: 4, c: eye }, { x: 7, y: 4, c: fur }, { x: 8, y: 4, c: eye }, { x: 9, y: 4, c: fur }, { x: 10, y: 4, c: ear },
        { x: 3, y: 5, c: outline }, { x: 4, y: 5, c: fur }, { x: 5, y: 5, c: fur }, { x: 6, y: 5, c: fur }, { x: 7, y: 5, c: darkFur }, { x: 8, y: 5, c: fur }, { x: 9, y: 5, c: fur }, { x: 10, y: 5, c: outline },
        { x: 4, y: 6, c: outline }, { x: 5, y: 6, c: fur }, { x: 6, y: 6, c: tongue }, { x: 7, y: 6, c: tongue }, { x: 8, y: 6, c: fur }, { x: 9, y: 6, c: outline },
      ];
      this.drawPixels(ctx, headPixels, 15, 0, 1);

      // Body
      const bodyPixels = [
        { x: 10, y: 7, c: outline }, { x: 11, y: 7, c: fur }, { x: 12, y: 7, c: fur }, { x: 13, y: 7, c: fur }, { x: 14, y: 7, c: fur }, { x: 15, y: 7, c: fur }, { x: 16, y: 7, c: fur }, { x: 17, y: 7, c: fur }, { x: 18, y: 7, c: fur }, { x: 19, y: 7, c: outline },
        { x: 9, y: 8, c: outline }, { x: 10, y: 8, c: fur }, { x: 11, y: 8, c: fur }, { x: 12, y: 8, c: fur }, { x: 13, y: 8, c: fur }, { x: 14, y: 8, c: fur }, { x: 15, y: 8, c: fur }, { x: 16, y: 8, c: fur }, { x: 17, y: 8, c: fur }, { x: 18, y: 8, c: fur }, { x: 19, y: 8, c: fur }, { x: 20, y: 8, c: outline },
        { x: 9, y: 9, c: outline }, { x: 10, y: 9, c: fur }, { x: 11, y: 9, c: darkFur }, { x: 12, y: 9, c: fur }, { x: 13, y: 9, c: fur }, { x: 14, y: 9, c: fur }, { x: 15, y: 9, c: fur }, { x: 16, y: 9, c: fur }, { x: 17, y: 9, c: fur }, { x: 18, y: 9, c: darkFur }, { x: 19, y: 9, c: fur }, { x: 20, y: 9, c: outline },
        { x: 9, y: 10, c: outline }, { x: 10, y: 10, c: fur }, { x: 11, y: 10, c: fur }, { x: 12, y: 10, c: fur }, { x: 13, y: 10, c: fur }, { x: 14, y: 10, c: fur }, { x: 15, y: 10, c: fur }, { x: 16, y: 10, c: fur }, { x: 17, y: 10, c: fur }, { x: 18, y: 10, c: fur }, { x: 19, y: 10, c: fur }, { x: 20, y: 10, c: outline },
        { x: 10, y: 11, c: outline }, { x: 11, y: 11, c: fur }, { x: 12, y: 11, c: fur }, { x: 13, y: 11, c: fur }, { x: 14, y: 11, c: fur }, { x: 15, y: 11, c: fur }, { x: 16, y: 11, c: fur }, { x: 17, y: 11, c: fur }, { x: 18, y: 11, c: fur }, { x: 19, y: 11, c: outline },
      ];
      this.drawPixels(ctx, bodyPixels, 0, 0, 1);

      // Tail
      for (let i = 0; i < 6; i++) {
        this.drawPixel(ctx, 7 - i, 6 + i, outline, 1);
        this.drawPixel(ctx, 8 - i, 6 + i, fur, 1);
        this.drawPixel(ctx, 9 - i, 6 + i, outline, 1);
      }

      // Legs
      const legPositions = [11, 14, 16, 19];
      legPositions.forEach((lx, i) => {
        const yOffset = i % 2 === 0 ? 12 : 11;
        for (let y = yOffset; y < 28; y++) {
          this.drawPixel(ctx, lx - 1, y, outline, 1);
          this.drawPixel(ctx, lx, y, fur, 1);
          this.drawPixel(ctx, lx + 1, y, outline, 1);
        }
        // Paws
        this.drawPixel(ctx, lx - 2, 27, outline, 1);
        this.drawPixel(ctx, lx - 1, 27, darkFur, 1);
        this.drawPixel(ctx, lx, 27, darkFur, 1);
        this.drawPixel(ctx, lx + 1, 27, darkFur, 1);
        this.drawPixel(ctx, lx + 2, 27, outline, 1);
      });
    }

    (scene.textures as any).addImage(`obstacle_${type}`, canvas as any);
  }

  static generatePowerUp(scene: Phaser.Scene, type: PowerUpType): void {
    const config = POWERUP_CONFIGS[type];
    const width = config.width;
    const height = config.height;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    if (type === 'shoe') {
      // Sneaker - red with white stripes
      const shoe = 0xFF6B6B;
      const sole = 0xFFFFFF;
      const lace = 0xFFFFFF;
      const outline = 0x000000;

      for (let y = 0; y < 8; y++) {
        for (let x = 4; x < 20; x++) {
          if (y === 0 || y === 7 || x === 4 || x === 19) {
            this.drawPixel(ctx, x, y, outline, 1);
          } else if (y === 6) {
            this.drawPixel(ctx, x, y, sole, 1);
          } else {
            this.drawPixel(ctx, x, y, shoe, 1);
          }
        }
      }
      // Laces
      for (let i = 0; i < 3; i++) {
        this.drawPixel(ctx, 8 + i * 3, 2, lace, 1);
        this.drawPixel(ctx, 9 + i * 3, 3, lace, 1);
        this.drawPixel(ctx, 8 + i * 3, 4, lace, 1);
      }
      // Stripe
      for (let x = 14; x < 18; x++) {
        this.drawPixel(ctx, x, 3, sole, 1);
        this.drawPixel(ctx, x, 4, sole, 1);
      }
    } else if (type === 'watch') {
      // Smart watch
      const band = 0x4ECDC4;
      const screen = 0x000000;
      const display = 0x00FF00;
      const outline = 0x000000;
      const button = 0xC0C0C0;

      // Top band
      for (let y = 0; y < 4; y++) {
        for (let x = 7; x < 15; x++) {
          if (x === 7 || x === 14 || y === 0) {
            this.drawPixel(ctx, x, y, outline, 1);
          } else {
            this.drawPixel(ctx, x, y, band, 1);
          }
        }
      }
      // Watch case
      for (let y = 4; y < 18; y++) {
        for (let x = 3; x < 19; x++) {
          if (x === 3 || x === 18 || y === 4 || y === 17) {
            this.drawPixel(ctx, x, y, outline, 1);
          } else if (x >= 5 && x <= 16 && y >= 6 && y <= 15) {
            this.drawPixel(ctx, x, y, screen, 1);
          } else {
            this.drawPixel(ctx, x, y, band, 1);
          }
        }
      }
      // Screen display - heart icon
      const heartPixels = [
        { x: 7, y: 8, c: display }, { x: 8, y: 8, c: display }, { x: 10, y: 8, c: display }, { x: 11, y: 8, c: display },
        { x: 6, y: 9, c: display }, { x: 7, y: 9, c: display }, { x: 8, y: 9, c: display }, { x: 9, y: 9, c: display }, { x: 10, y: 9, c: display }, { x: 11, y: 9, c: display }, { x: 12, y: 9, c: display },
        { x: 6, y: 10, c: display }, { x: 7, y: 10, c: display }, { x: 8, y: 10, c: display }, { x: 9, y: 10, c: display }, { x: 10, y: 10, c: display }, { x: 11, y: 10, c: display }, { x: 12, y: 10, c: display },
        { x: 7, y: 11, c: display }, { x: 8, y: 11, c: display }, { x: 9, y: 11, c: display }, { x: 10, y: 11, c: display }, { x: 11, y: 11, c: display },
        { x: 8, y: 12, c: display }, { x: 9, y: 12, c: display }, { x: 10, y: 12, c: display },
        { x: 9, y: 13, c: display },
      ];
      this.drawPixels(ctx, heartPixels, 0, 0, 1);

      // Button on side
      this.drawPixel(ctx, 19, 9, button, 1);
      this.drawPixel(ctx, 19, 10, button, 1);
      this.drawPixel(ctx, 19, 11, button, 1);

      // Bottom band
      for (let y = 18; y < 22; y++) {
        for (let x = 7; x < 15; x++) {
          if (x === 7 || x === 14 || y === 21) {
            this.drawPixel(ctx, x, y, outline, 1);
          } else {
            this.drawPixel(ctx, x, y, band, 1);
          }
        }
      }
    }

    (scene.textures as any).addImage(`powerup_${type}`, canvas as any);

    // Glow animation frame
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = width + 8;
    glowCanvas.height = height + 8;
    const glowCtx = glowCanvas.getContext('2d')!;

    glowCtx.fillStyle = 'rgba(255, 215, 0, 0.3)';
    glowCtx.fillRect(0, 0, width + 8, height + 8);
    glowCtx.drawImage(canvas, 4, 4);

    (scene.textures as any).addImage(`powerup_${type}_glow`, glowCanvas as any);
  }

  static generateBackground(scene: Phaser.Scene): void {
    // Sky gradient
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 1600;
    skyCanvas.height = 300;
    const skyCtx = skyCanvas.getContext('2d')!;

    const gradient = skyCtx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, this.hexToRgb(0x87CEEB));
    gradient.addColorStop(0.5, this.hexToRgb(0xB0E0E6));
    gradient.addColorStop(1, this.hexToRgb(0xE0F7FA));
    skyCtx.fillStyle = gradient;
    skyCtx.fillRect(0, 0, 1600, 300);

    // Sun rays
    skyCtx.save();
    skyCtx.globalAlpha = 0.15;
    skyCtx.fillStyle = this.hexToRgb(0xFFD700);
    for (let i = 0; i < 12; i++) {
      skyCtx.beginPath();
      skyCtx.moveTo(200, 50);
      const angle = (i / 12) * Math.PI * 2;
      skyCtx.lineTo(200 + Math.cos(angle) * 800, 50 + Math.sin(angle) * 400);
      skyCtx.lineTo(200 + Math.cos(angle + 0.1) * 800, 50 + Math.sin(angle + 0.1) * 400);
      skyCtx.closePath();
      skyCtx.fill();
    }
    skyCtx.restore();

    // Clouds
    const drawCloud = (x: number, y: number, scale: number) => {
      skyCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      const s = scale;
      skyCtx.beginPath();
      skyCtx.arc(x, y, 20 * s, 0, Math.PI * 2);
      skyCtx.arc(x + 25 * s, y - 10 * s, 25 * s, 0, Math.PI * 2);
      skyCtx.arc(x + 50 * s, y, 20 * s, 0, Math.PI * 2);
      skyCtx.arc(x + 25 * s, y + 5 * s, 18 * s, 0, Math.PI * 2);
      skyCtx.fill();
    };
    drawCloud(100, 60, 1);
    drawCloud(400, 80, 0.8);
    drawCloud(700, 50, 1.2);
    drawCloud(1000, 90, 0.9);
    drawCloud(1300, 60, 1.1);

    // Sun
    skyCtx.fillStyle = this.hexToRgb(0xFFD700);
    skyCtx.beginPath();
    skyCtx.arc(200, 50, 35, 0, Math.PI * 2);
    skyCtx.fill();
    skyCtx.fillStyle = this.hexToRgb(0xFFA500);
    skyCtx.beginPath();
    skyCtx.arc(200, 50, 28, 0, Math.PI * 2);
    skyCtx.fill();

    (scene.textures as any).addImage('bg_sky', skyCanvas as any);

    // Far trees (parallax layer 1)
    const farTreesCanvas = document.createElement('canvas');
    farTreesCanvas.width = 1600;
    farTreesCanvas.height = 200;
    const farCtx = farTreesCanvas.getContext('2d')!;

    for (let i = 0; i < 20; i++) {
      const x = i * 80 + Math.random() * 30;
      const h = 80 + Math.random() * 60;
      // Trunk
      farCtx.fillStyle = this.hexToRgb(0x654321);
      farCtx.fillRect(x + 18, 200 - h + 40, 8, h - 40);
      // Foliage
      farCtx.fillStyle = this.hexToRgb(0x2E7D32);
      farCtx.beginPath();
      farCtx.moveTo(x + 10, 200 - h + 60);
      farCtx.lineTo(x + 22, 200 - h);
      farCtx.lineTo(x + 34, 200 - h + 60);
      farCtx.closePath();
      farCtx.fill();
      farCtx.beginPath();
      farCtx.moveTo(x + 6, 200 - h + 90);
      farCtx.lineTo(x + 22, 200 - h + 30);
      farCtx.lineTo(x + 38, 200 - h + 90);
      farCtx.closePath();
      farCtx.fill();
    }

    (scene.textures as any).addImage('bg_far_trees', farTreesCanvas as any);

    // Near bushes (parallax layer 2)
    const nearBushesCanvas = document.createElement('canvas');
    nearBushesCanvas.width = 1600;
    nearBushesCanvas.height = 100;
    const nearCtx = nearBushesCanvas.getContext('2d')!;

    for (let i = 0; i < 25; i++) {
      const x = i * 64 + Math.random() * 20;
      const w = 40 + Math.random() * 30;
      const h = 30 + Math.random() * 25;

      nearCtx.fillStyle = this.hexToRgb(0x388E3C);
      nearCtx.beginPath();
      nearCtx.arc(x, 100 - h / 2, h / 2, 0, Math.PI * 2);
      nearCtx.arc(x + w / 2, 100 - h / 2 - 5, h / 2 + 5, 0, Math.PI * 2);
      nearCtx.arc(x + w, 100 - h / 2, h / 2, 0, Math.PI * 2);
      nearCtx.fill();

      nearCtx.fillStyle = this.hexToRgb(0x2E7D32);
      nearCtx.beginPath();
      nearCtx.arc(x + 5, 100 - h / 2 + 5, h / 3, 0, Math.PI * 2);
      nearCtx.arc(x + w - 5, 100 - h / 2 + 5, h / 3, 0, Math.PI * 2);
      nearCtx.fill();
    }

    (scene.textures as any).addImage('bg_near_bushes', nearBushesCanvas as any);
  }

  static generateGround(scene: Phaser.Scene): void {
    const groundCanvas = document.createElement('canvas');
    groundCanvas.width = 1600;
    groundCanvas.height = 80;
    const ctx = groundCanvas.getContext('2d')!;

    // Grass top
    for (let x = 0; x < 1600; x += 4) {
      const grassHeight = 4 + Math.floor(Math.random() * 4);
      for (let y = 0; y < grassHeight; y++) {
        const shade = Math.random() > 0.5 ? 0x90EE90 : 0x98FB98;
        ctx.fillStyle = this.hexToRgb(shade);
        ctx.fillRect(x, y, 4, 1);
      }
    }

    // Grass layer
    ctx.fillStyle = this.hexToRgb(0x7CB342);
    ctx.fillRect(0, 8, 1600, 12);

    // Dirt layers
    for (let y = 20; y < 80; y += 2) {
      const shade = y < 40 ? 0x8B4513 : 0x654321;
      ctx.fillStyle = this.hexToRgb(shade);
      ctx.fillRect(0, y, 1600, 1);

      // Random pebbles
      if (y % 4 === 0) {
        for (let x = 0; x < 1600; x += 20 + Math.random() * 30) {
          const pebbleShade = Math.random() > 0.5 ? 0xA0522D : 0xCD853F;
          ctx.fillStyle = this.hexToRgb(pebbleShade);
          const px = x + Math.random() * 15;
          const py = y + Math.random() * 2;
          ctx.fillRect(px, py, 2, 2);
        }
      }
    }

    (scene.textures as any).addImage('ground', groundCanvas as any);
  }

  static generateHeart(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext('2d')!;

    const heartPixels = [
      { x: 6, y: 4, c: COLORS.RED }, { x: 7, y: 4, c: COLORS.RED }, { x: 10, y: 4, c: COLORS.RED }, { x: 11, y: 4, c: COLORS.RED },
      { x: 5, y: 5, c: COLORS.RED }, { x: 6, y: 5, c: COLORS.RED }, { x: 7, y: 5, c: COLORS.RED }, { x: 8, y: 5, c: COLORS.RED }, { x: 9, y: 5, c: COLORS.RED }, { x: 10, y: 5, c: COLORS.RED }, { x: 11, y: 5, c: COLORS.RED }, { x: 12, y: 5, c: COLORS.RED },
      { x: 4, y: 6, c: COLORS.RED }, { x: 5, y: 6, c: COLORS.RED }, { x: 6, y: 6, c: COLORS.RED }, { x: 7, y: 6, c: COLORS.RED }, { x: 8, y: 6, c: COLORS.RED }, { x: 9, y: 6, c: COLORS.RED }, { x: 10, y: 6, c: COLORS.RED }, { x: 11, y: 6, c: COLORS.RED }, { x: 12, y: 6, c: COLORS.RED }, { x: 13, y: 6, c: COLORS.RED },
      { x: 4, y: 7, c: COLORS.RED }, { x: 5, y: 7, c: COLORS.RED }, { x: 6, y: 7, c: COLORS.RED }, { x: 7, y: 7, c: COLORS.RED }, { x: 8, y: 7, c: COLORS.RED }, { x: 9, y: 7, c: COLORS.RED }, { x: 10, y: 7, c: COLORS.RED }, { x: 11, y: 7, c: COLORS.RED }, { x: 12, y: 7, c: COLORS.RED }, { x: 13, y: 7, c: COLORS.RED },
      { x: 5, y: 8, c: COLORS.RED }, { x: 6, y: 8, c: COLORS.RED }, { x: 7, y: 8, c: COLORS.RED }, { x: 8, y: 8, c: COLORS.RED }, { x: 9, y: 8, c: COLORS.RED }, { x: 10, y: 8, c: COLORS.RED }, { x: 11, y: 8, c: COLORS.RED }, { x: 12, y: 8, c: COLORS.RED },
      { x: 6, y: 9, c: COLORS.RED }, { x: 7, y: 9, c: COLORS.RED }, { x: 8, y: 9, c: COLORS.RED }, { x: 9, y: 9, c: COLORS.RED }, { x: 10, y: 9, c: COLORS.RED }, { x: 11, y: 9, c: COLORS.RED },
      { x: 7, y: 10, c: COLORS.RED }, { x: 8, y: 10, c: COLORS.RED }, { x: 9, y: 10, c: COLORS.RED }, { x: 10, y: 10, c: COLORS.RED },
      { x: 8, y: 11, c: COLORS.RED }, { x: 9, y: 11, c: COLORS.RED },
    ];
    this.drawPixels(ctx, heartPixels, 0, 0, 1);

    // Outline
    ctx.strokeStyle = this.hexToRgb(COLORS.BLACK);
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 24, 24);

    (scene.textures as any).addImage('heart', canvas as any);

    // Empty heart
    const emptyCanvas = document.createElement('canvas');
    emptyCanvas.width = 24;
    emptyCanvas.height = 24;
    const emptyCtx = emptyCanvas.getContext('2d')!;

    heartPixels.forEach(p => {
      this.drawPixel(emptyCtx, p.x, p.y, COLORS.GRAY, 1);
    });
    ctx.strokeStyle = this.hexToRgb(COLORS.BLACK);
    ctx.strokeRect(0, 0, 24, 24);

    (scene.textures as any).addImage('heart_empty', emptyCanvas as any);
  }

  static generateAll(scene: Phaser.Scene): void {
    this.generatePlayer(scene);
    this.generateObstacle(scene, 'bottle');
    this.generateObstacle(scene, 'fence');
    this.generateObstacle(scene, 'dog');
    this.generatePowerUp(scene, 'shoe');
    this.generatePowerUp(scene, 'watch');
    this.generateBackground(scene);
    this.generateGround(scene);
    this.generateHeart(scene);
  }
}

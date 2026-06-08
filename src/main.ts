import Phaser from 'phaser';
import { GameConfig } from './game/GameConfig';
import { BootScene } from './scenes/BootScene';
import { StartScene } from './scenes/StartScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';
import './style.css';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GameConfig.WIDTH,
  height: GameConfig.HEIGHT,
  parent: 'game-container',
  pixelArt: true,
  roundPixels: true,
  backgroundColor: '#87CEEB',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GameConfig.WIDTH,
    height: GameConfig.HEIGHT,
    min: {
      width: 400,
      height: 225,
    },
    max: {
      width: 1600,
      height: 900,
    },
  },
  input: {
    activePointers: 3,
  },
  scene: [BootScene, StartScene, GameScene, GameOverScene],
};

let game: Phaser.Game | null = null;

function createGame(): void {
  const container = document.getElementById('game-container');
  if (container) {
    game = new Phaser.Game(config);
  }
}

function resizeGame(): void {
  if (!game) return;

  const container = document.getElementById('game-container');
  if (!container) return;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const gameRatio = GameConfig.WIDTH / GameConfig.HEIGHT;
  const windowRatio = windowWidth / windowHeight;

  let width: number;
  let height: number;

  if (windowRatio > gameRatio) {
    height = windowHeight;
    width = height * gameRatio;
  } else {
    width = windowWidth;
    height = width / gameRatio;
  }

  container.style.width = `${Math.min(width, GameConfig.WIDTH)}px`;
  container.style.height = `${Math.min(height, GameConfig.HEIGHT)}px`;
}

window.addEventListener('load', () => {
  createGame();
  resizeGame();
});

window.addEventListener('resize', () => {
  resizeGame();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(createGame, 0);
}

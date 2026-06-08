export const GameConfig = {
  WIDTH: 800,
  HEIGHT: 450,
  GRAVITY: 800,
  JUMP_FORCE: -350,
  INITIAL_SPEED: 300,
  MAX_SPEED: 700,
  SPEED_INCREMENT: 8,
  INITIAL_OBSTACLE_INTERVAL: 2000,
  MIN_OBSTACLE_INTERVAL: 800,
  PLAYER_X: 100,
  GROUND_Y: 380,
  INITIAL_LIVES: 3,
  POWERUP_SHOE_DURATION: 5000,
  POWERUP_SPAWN_CHANCE: 0.15,
  PIXEL_SIZE: 2,
} as const;

export interface GameState {
  score: number;
  highScore: number;
  lives: number;
  speed: number;
  isBoost: boolean;
  isGameOver: boolean;
  isPaused: boolean;
}

export type ObstacleType = 'bottle' | 'fence' | 'dog';

export interface ObstacleConfig {
  type: ObstacleType;
  width: number;
  height: number;
  jumpForce: number;
}

export const OBSTACLE_CONFIGS: Record<ObstacleType, ObstacleConfig> = {
  bottle: { type: 'bottle', width: 20, height: 32, jumpForce: 280 },
  fence: { type: 'fence', width: 48, height: 40, jumpForce: 320 },
  dog: { type: 'dog', width: 40, height: 28, jumpForce: 300 },
};

export type PowerUpType = 'shoe' | 'watch';

export interface PowerUpConfig {
  type: PowerUpType;
  width: number;
  height: number;
  color: number;
}

export const POWERUP_CONFIGS: Record<PowerUpType, PowerUpConfig> = {
  shoe: { type: 'shoe', width: 24, height: 20, color: 0xff6b6b },
  watch: { type: 'watch', width: 22, height: 22, color: 0x4ecdc4 },
};

export const COLORS = {
  SKY: 0x87CEEB,
  GRASS: 0x90EE90,
  DIRT: 0x8B4513,
  GOLD: 0xFFD700,
  RED: 0xFF6B6B,
  CYAN: 0x4ECDC4,
  PURPLE: 0x9B59B6,
  WHITE: 0xFFFFFF,
  BLACK: 0x000000,
  BROWN: 0x654321,
  ORANGE: 0xFFA500,
  BLUE: 0x4169E1,
  PINK: 0xFF69B4,
  GRAY: 0x808080,
  DARK_GREEN: 0x228B22,
  LIGHT_GREEN: 0x98FB98,
} as const;

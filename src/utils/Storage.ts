const HIGH_SCORE_KEY = 'pixel_runner_high_score';

export class Storage {
  static getHighScore(): number {
    try {
      const score = localStorage.getItem(HIGH_SCORE_KEY);
      return score ? parseInt(score, 10) : 0;
    } catch {
      return 0;
    }
  }

  static setHighScore(score: number): void {
    try {
      const currentHigh = this.getHighScore();
      if (score > currentHigh) {
        localStorage.setItem(HIGH_SCORE_KEY, score.toString());
      }
    } catch {
      // Ignore storage errors
    }
  }

  static isNewHighScore(score: number): boolean {
    return score > this.getHighScore();
  }
}

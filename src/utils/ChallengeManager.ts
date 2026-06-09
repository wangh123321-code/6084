export type ChallengeType = 'obstacle_surge' | 'boost_power' | 'double_score' | 'speed_demon' | 'lucky_charms';

export interface ChallengeDef {
  type: ChallengeType;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const CHALLENGE_DEFS: ChallengeDef[] = [
  {
    type: 'obstacle_surge',
    name: '障碍密集',
    description: '障碍生成间隔缩短30%',
    icon: '🔥',
    color: '#FF6B6B',
  },
  {
    type: 'boost_power',
    name: '冲刺强化',
    description: '加速道具持续时间+50%',
    icon: '⚡',
    color: '#FFD700',
  },
  {
    type: 'double_score',
    name: '双倍得分',
    description: '距离得分翻倍',
    icon: '💰',
    color: '#4ECDC4',
  },
  {
    type: 'speed_demon',
    name: '速度恶魔',
    description: '初始和最大速度+20%',
    icon: '🌪️',
    color: '#9B59B6',
  },
  {
    type: 'lucky_charms',
    name: '道具福星',
    description: '道具生成频率+50%',
    icon: '🍀',
    color: '#90EE90',
  },
];

export interface ChallengeModifiers {
  obstacleIntervalMul: number;
  boostDurationMul: number;
  scoreMul: number;
  speedMul: number;
  powerUpIntervalMul: number;
}

const DEFAULT_MODIFIERS: ChallengeModifiers = {
  obstacleIntervalMul: 1,
  boostDurationMul: 1,
  scoreMul: 1,
  speedMul: 1,
  powerUpIntervalMul: 1,
};

const MODIFIER_MAP: Record<ChallengeType, Partial<ChallengeModifiers>> = {
  obstacle_surge: { obstacleIntervalMul: 0.7 },
  boost_power: { boostDurationMul: 1.5 },
  double_score: { scoreMul: 2 },
  speed_demon: { speedMul: 1.2 },
  lucky_charms: { powerUpIntervalMul: 0.5 },
};

export interface DailyChallenge {
  date: string;
  activeTypes: ChallengeType[];
}

const CHALLENGE_KEY = 'pixel_runner_daily_challenge';

function hashDate(dateStr: string): number {
  let h = 0;
  for (let i = 0; i < dateStr.length; i++) {
    h = ((h << 5) - h + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function getTodayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function generateDailyChallenge(dateStr: string): DailyChallenge {
  const h = hashDate(dateStr);
  const rng = seededRandom(h);

  const count = 1 + Math.floor(rng() * 2);

  const indices: number[] = [];
  const available = CHALLENGE_DEFS.map((_, i) => i);

  for (let i = 0; i < count && available.length > 0; i++) {
    const pick = Math.floor(rng() * available.length);
    indices.push(available[pick]);
    available.splice(pick, 1);
  }

  return {
    date: dateStr,
    activeTypes: indices.map(i => CHALLENGE_DEFS[i].type),
  };
}

export class ChallengeManager {
  private static cached: DailyChallenge | null = null;
  private static cachedDate: string = '';

  static getTodayChallenge(): DailyChallenge {
    const today = getTodayStr();

    if (this.cached && this.cachedDate === today) {
      return this.cached;
    }

    const stored = this.loadFromStorage();
    if (stored && stored.date === today) {
      this.cached = stored;
      this.cachedDate = today;
      return stored;
    }

    const challenge = generateDailyChallenge(today);
    this.cached = challenge;
    this.cachedDate = today;
    this.saveToStorage(challenge);
    return challenge;
  }

  static getModifiers(): ChallengeModifiers {
    const challenge = this.getTodayChallenge();
    const mods = { ...DEFAULT_MODIFIERS };

    for (const t of challenge.activeTypes) {
      const m = MODIFIER_MAP[t];
      Object.assign(mods, m);
    }

    return mods;
  }

  static getActiveDefs(): ChallengeDef[] {
    const challenge = this.getTodayChallenge();
    return challenge.activeTypes.map(t => CHALLENGE_DEFS.find(d => d.type === t)!);
  }

  static isActive(type: ChallengeType): boolean {
    const challenge = this.getTodayChallenge();
    return challenge.activeTypes.includes(type);
  }

  private static loadFromStorage(): DailyChallenge | null {
    try {
      const raw = localStorage.getItem(CHALLENGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.date !== 'string' || !Array.isArray(parsed.activeTypes)) {
        return null;
      }
      return {
        date: parsed.date,
        activeTypes: parsed.activeTypes,
      } as DailyChallenge;
    } catch {
      return null;
    }
  }

  private static saveToStorage(challenge: DailyChallenge): void {
    try {
      localStorage.setItem(CHALLENGE_KEY, JSON.stringify(challenge));
    } catch {
      // Ignore storage errors
    }
  }
}

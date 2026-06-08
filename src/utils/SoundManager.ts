export class SoundManager {
  private audioContext: AudioContext | null = null;
  private bgmOscillator: OscillatorNode | null = null;
  private bgmGain: GainNode | null = null;
  private bgmInterval: number | null = null;
  private volume: number = 0.15;
  private isMuted: boolean = false;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      console.warn('Web Audio API not supported');
    }
  }

  private ensureAudioContext(): AudioContext | null {
    if (!this.audioContext) {
      this.initAudioContext();
    }
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.stopBGM();
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
    }
    return this.isMuted;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'square',
    volume: number = this.volume
  ): void {
    if (this.isMuted) return;
    const ctx = this.ensureAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  playJump(): void {
    if (this.isMuted) return;
    const ctx = this.ensureAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(300, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  playPickup(): void {
    if (this.isMuted) return;
    const ctx = this.ensureAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(523, ctx.currentTime);
    oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.05);
    oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }

  playHurt(): void {
    if (this.isMuted) return;
    const ctx = this.ensureAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.25);
  }

  playGameOver(): void {
    if (this.isMuted) return;
    const notes = [523, 494, 440, 392, 349];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.3, 'square', this.volume * 0.8);
      }, i * 150);
    });
  }

  startBGM(): void {
    if (this.isMuted) return;
    this.stopBGM();
    const ctx = this.ensureAudioContext();
    if (!ctx) return;

    const melody = [
      { freq: 523, dur: 0.15 },
      { freq: 659, dur: 0.15 },
      { freq: 784, dur: 0.15 },
      { freq: 659, dur: 0.15 },
      { freq: 523, dur: 0.15 },
      { freq: 0, dur: 0.1 },
      { freq: 587, dur: 0.15 },
      { freq: 784, dur: 0.15 },
      { freq: 880, dur: 0.15 },
      { freq: 784, dur: 0.15 },
      { freq: 587, dur: 0.15 },
      { freq: 0, dur: 0.1 },
    ];

    let noteIndex = 0;
    const playNextNote = () => {
      if (this.isMuted) return;
      const note = melody[noteIndex % melody.length];
      if (note.freq > 0) {
        this.playTone(note.freq, note.dur * 0.9, 'square', this.volume * 0.5);
      }
      noteIndex++;
    };

    playNextNote();
    this.bgmInterval = window.setInterval(playNextNote, 180);
  }

  stopBGM(): void {
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    if (this.bgmOscillator) {
      try {
        this.bgmOscillator.stop();
      } catch {
        // Ignore
      }
      this.bgmOscillator = null;
    }
    this.bgmGain = null;
  }
}

export const soundManager = new SoundManager();

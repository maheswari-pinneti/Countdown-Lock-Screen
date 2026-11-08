/**
 * Ambient Audio Service for Deep Work & Focus Hub
 * Synthesizes white/brown noise, rain drizzle, and theta binaural beats in real-time
 * using the HTML5 Web Audio API with zero external audio assets or network downloads.
 */

export type AmbientSoundType = 'brown_noise' | 'rain_drizzle' | 'binaural_theta';

class AmbientAudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | { stop?: () => void; disconnect: () => void })[] = [];
  private currentType: AmbientSoundType | null = null;
  private volume: number = 0.25;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setVolume(newVolume: number): void {
    this.volume = Math.max(0, Math.min(1, newVolume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public isPlaying(): boolean {
    return this.currentType !== null;
  }

  public getCurrentType(): AmbientSoundType | null {
    return this.currentType;
  }

  public stopSound(): void {
    if (this.activeNodes.length > 0) {
      this.activeNodes.forEach((node) => {
        try {
          if ('stop' in node && typeof node.stop === 'function') {
            node.stop();
          }
          node.disconnect();
        } catch {
          // Ignore disconnection cleanup errors
        }
      });
      this.activeNodes = [];
    }
    this.currentType = null;
  }

  public startSound(type: AmbientSoundType, customVolume?: number): void {
    this.stopSound();

    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    if (customVolume !== undefined) {
      this.setVolume(customVolume);
    }

    this.currentType = type;

    if (type === 'brown_noise') {
      this.createBrownNoise(ctx);
    } else if (type === 'rain_drizzle') {
      this.createRainDrizzle(ctx);
    } else if (type === 'binaural_theta') {
      this.createBinauralBeat(ctx);
    }
  }

  private createBrownNoise(ctx: AudioContext): void {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain compensation
    }

    const whiteNoiseSource = ctx.createBufferSource();
    whiteNoiseSource.buffer = noiseBuffer;
    whiteNoiseSource.loop = true;

    // Gentle low-pass filter for cozy warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    whiteNoiseSource.connect(filter);
    filter.connect(this.masterGain!);

    whiteNoiseSource.start();
    this.activeNodes.push(whiteNoiseSource, filter);
  }

  private createRainDrizzle(ctx: AudioContext): void {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Bandpass filter centered at 1200Hz to simulate rain drops
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1100, ctx.currentTime);
    bandpass.Q.setValueAtTime(0.8, ctx.currentTime);

    // Subtle lowpass
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(3200, ctx.currentTime);

    noiseSource.connect(bandpass);
    bandpass.connect(lowpass);
    lowpass.connect(this.masterGain!);

    noiseSource.start();
    this.activeNodes.push(noiseSource, bandpass, lowpass);
  }

  private createBinauralBeat(ctx: AudioContext): void {
    // 210 Hz left ear, 214 Hz right ear = 4 Hz Theta binaural beat for deep cognitive flow
    const baseFreq = 210;
    const beatFreq = 4;

    const oscLeft = ctx.createOscillator();
    const oscRight = ctx.createOscillator();
    oscLeft.type = 'sine';
    oscRight.type = 'sine';

    oscLeft.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    oscRight.frequency.setValueAtTime(baseFreq + beatFreq, ctx.currentTime);

    const merger = ctx.createChannelMerger(2);

    oscLeft.connect(merger, 0, 0); // Left channel
    oscRight.connect(merger, 0, 1); // Right channel

    merger.connect(this.masterGain!);

    oscLeft.start();
    oscRight.start();

    this.activeNodes.push(oscLeft, oscRight, merger);
  }
}

export const ambientAudio = new AmbientAudioService();

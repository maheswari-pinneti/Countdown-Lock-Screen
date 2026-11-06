// Web Audio API Procedural Sound Engine
// Synthesizes ambient generative soundscapes, keyboard clicks, tick pulses, and success chimes

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientSources: AudioNode[] = [];
  private isMuted: boolean = false;
  private masterVolume: number = 0.3;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(this.isMuted ? 0 : this.masterVolume * 0.15, this.ctx.currentTime, 0.1);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(muted ? 0 : this.masterVolume * 0.15, this.ctx.currentTime, 0.1);
    }
  }

  public playTick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(this.masterVolume * 0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  public playKeyClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // Soft mechanical click using white noise burst + resonant bandpass
      const bufferSize = this.ctx.sampleRate * 0.03;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1600 + Math.random() * 400;
      filter.Q.value = 3;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.masterVolume * 0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.025);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {}
  }

  public playSuccessChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
      freqs.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + index * 0.08);

        gain.gain.setValueAtTime(0, this.ctx!.currentTime + index * 0.08);
        gain.gain.linearRampToValueAtTime(this.masterVolume * 0.2, this.ctx!.currentTime + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + index * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + index * 0.08);
        osc.stop(this.ctx!.currentTime + index * 0.08 + 0.7);
      });
    } catch (e) {}
  }

  public stopAmbient() {
    this.ambientSources.forEach(s => {
      try {
        (s as any).stop?.();
        s.disconnect();
      } catch (e) {}
    });
    this.ambientSources = [];
    if (this.ambientGain) {
      try {
        this.ambientGain.disconnect();
      } catch (e) {}
      this.ambientGain = null;
    }
  }

  public playAmbient(type: 'cyber_hum' | 'ticker_market' | 'rain_lofi' | 'binaural_focus' | 'stealth_radar') {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      this.stopAmbient();

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume * 0.12, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      if (type === 'cyber_hum') {
        // Deep sub drone + subtle harmonic
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

        const osc2 = this.ctx.createOscillator();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(110, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(180, this.ctx.currentTime);

        osc1.connect(this.ambientGain);
        osc2.connect(filter);
        filter.connect(this.ambientGain);

        osc1.start();
        osc2.start();
        this.ambientSources.push(osc1, osc2, filter);
      } else if (type === 'binaural_focus') {
        // 432 Hz + 440 Hz alpha wave beat (8 Hz difference)
        const leftOsc = this.ctx.createOscillator();
        leftOsc.type = 'sine';
        leftOsc.frequency.setValueAtTime(216, this.ctx.currentTime);

        const rightOsc = this.ctx.createOscillator();
        rightOsc.type = 'sine';
        rightOsc.frequency.setValueAtTime(224, this.ctx.currentTime);

        const merger = this.ctx.createChannelMerger(2);
        leftOsc.connect(merger, 0, 0);
        rightOsc.connect(merger, 0, 1);

        merger.connect(this.ambientGain);

        leftOsc.start();
        rightOsc.start();
        this.ambientSources.push(leftOsc, rightOsc, merger);
      } else if (type === 'rain_lofi' || type === 'ticker_market') {
        // Filtered pink-ish noise texture
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.11;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = type === 'rain_lofi' ? 'lowpass' : 'bandpass';
        filter.frequency.value = type === 'rain_lofi' ? 450 : 800;

        whiteNoise.connect(filter);
        filter.connect(this.ambientGain);

        whiteNoise.start();
        this.ambientSources.push(whiteNoise, filter);
      } else if (type === 'stealth_radar') {
        // Ultra subtle deep pulse
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, this.ctx.currentTime);

        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.5, this.ctx.currentTime); // 0.5 Hz pulse

        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

        lfo.connect(lfoGain.gain);
        osc.connect(lfoGain);
        lfoGain.connect(this.ambientGain);

        osc.start();
        lfo.start();
        this.ambientSources.push(osc, lfo, lfoGain);
      }
    } catch (e) {}
  }
}

export const soundEngine = new SoundEngine();

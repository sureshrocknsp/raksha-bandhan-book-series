/**
 * Premium Indian Classical Soundtrack & Sound Engine
 * Plays "Akhanda Rakhi" (assets/audio/akhanda_rakhi.mp3) with Web Audio fallback,
 * realistic page-turn sound effects, and emotional atmosphere.
 */

class SoundEngine {
  constructor() {
    this.audioElement = null;
    this.isPlaying = false;
    this.ctx = null;
    this.isSynthesizer = false;
    this.tanpuraOscs = [];
    this.fluteTimer = null;
    this.droneGain = null;
    this.fluteGain = null;
    this.masterGain = null;
    this.currentMood = 'peaceful_home';

    this.initAudioElement();
  }

  initAudioElement() {
    try {
      this.audioElement = new Audio('assets/audio/akhanda_rakhi.mp3');
      this.audioElement.loop = true;
      this.audioElement.volume = 0.75;
      this.audioElement.preload = 'auto';
    } catch (e) {
      console.warn("Audio element init fallback:", e);
    }
  }

  startMusic() {
    if (this.isPlaying) return true;

    if (this.audioElement) {
      this.audioElement.play().then(() => {
        this.isPlaying = true;
      }).catch(err => {
        console.warn("Audio play prevented or unavailable, fallback to synth:", err);
        this.startSynthesizer();
      });
    } else {
      this.startSynthesizer();
    }
    return true;
  }

  stopMusic() {
    if (!this.isPlaying) return false;
    this.isPlaying = false;

    if (this.audioElement) {
      this.audioElement.pause();
    }

    if (this.isSynthesizer) {
      this.stopSynthesizer();
    }
    return false;
  }

  toggleMusic() {
    if (this.isPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  initWebAudio() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    this.droneGain.connect(this.masterGain);

    this.fluteGain = this.ctx.createGain();
    this.fluteGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    this.fluteGain.connect(this.masterGain);
  }

  startSynthesizer() {
    this.initWebAudio();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isSynthesizer = true;
    this.isPlaying = true;
    this.startTanpuraDrone();
    this.scheduleFluteNotes();
  }

  stopSynthesizer() {
    this.isSynthesizer = false;
    this.tanpuraOscs.forEach(({ osc, gain }) => {
      try {
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
        setTimeout(() => osc.stop(), 600);
      } catch (e) {}
    });
    this.tanpuraOscs = [];
    if (this.fluteTimer) {
      clearTimeout(this.fluteTimer);
      this.fluteTimer = null;
    }
  }

  startTanpuraDrone() {
    const baseFreqs = [73.42, 110.00, 146.83, 147.1];
    baseFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05 / (idx + 1), this.ctx.currentTime + 2);

      osc.connect(gain);
      gain.connect(this.droneGain);
      osc.start();

      this.tanpuraOscs.push({ osc, gain });
    });
  }

  scheduleFluteNotes() {
    if (!this.isPlaying || !this.isSynthesizer) return;

    const mohanam = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33];
    const note = mohanam[Math.floor(Math.random() * mohanam.length)];
    const duration = 2.2 + Math.random() * 2.0;

    this.playBansuriTone(note, duration);

    const nextDelay = (duration + 1.2 + Math.random() * 2.5) * 1000;
    this.fluteTimer = setTimeout(() => {
      this.scheduleFluteNotes();
    }, nextDelay);
  }

  playBansuriTone(freq, duration) {
    if (!this.ctx || !this.isPlaying) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.5, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.6);
    gain.gain.linearRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.fluteGain);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  playPageTurn() {
    try {
      this.initWebAudio();
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();

      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      whiteNoise.start();
    } catch (e) {}
  }

  setPageMood(mood) {
    this.currentMood = mood;
  }
}

export const soundEngine = new SoundEngine();

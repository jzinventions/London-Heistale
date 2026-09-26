/**
 * Enhanced Web Audio API & Web Speech Engine
 * - PS1 Boot Chime & EA Sports Parody Voice
 * - Real Character Voice Acting via Web SpeechSynthesis (British en-GB accents)
 * - Authentic Undertale sound effects, 8-bit blip talking, footsteps, phone rings
 * - Multi-track procedural PS1 & Chiptune soundtrack (Pub folk, London rain noir, Vault tension, High-speed pursuit, Heartbreaking sad ending)
 */

class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.7;
  private bgmVolume: number = 0.5;
  private voiceVolume: number = 0.85;
  private realVoiceEnabled: boolean = true;

  private currentBgmTrack: string | null = null;
  private bgmInterval: number | null = null;
  private activeVoices: SpeechSynthesisUtterance | null = null;

  constructor() {
    // Initialized lazily on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.musicGain.gain.setValueAtTime(this.isMuted ? 0 : this.bgmVolume, this.ctx.currentTime);
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime);

      this.musicGain.connect(this.ctx.destination);
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.musicGain && this.sfxGain) {
      this.musicGain.gain.setValueAtTime(muted ? 0 : this.bgmVolume, this.ctx.currentTime);
      this.sfxGain.gain.setValueAtTime(muted ? 0 : this.sfxVolume, this.ctx.currentTime);
    }
    if (muted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setRealVoiceEnabled(enabled: boolean) {
    this.realVoiceEnabled = enabled;
    if (!enabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public getRealVoiceEnabled(): boolean {
    return this.realVoiceEnabled;
  }

  public setVolumes(bgm: number, sfx: number, voice: number = 0.85) {
    this.bgmVolume = Math.max(0, Math.min(1, bgm));
    this.sfxVolume = Math.max(0, Math.min(1, sfx));
    this.voiceVolume = Math.max(0, Math.min(1, voice));
    if (this.ctx && this.musicGain && this.sfxGain && !this.isMuted) {
      this.musicGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  public getVolumes() {
    return { bgm: this.bgmVolume, sfx: this.sfxVolume, voice: this.voiceVolume };
  }

  // ==========================================
  // REAL VOICE TALKING (Web SpeechSynthesis)
  // ==========================================
  public speakDialogue(text: string, voiceType: 'narrator' | 'arthur' | 'dave' | 'dizzy' | 'police' | 'phone' | 'star' = 'narrator') {
    if (!this.realVoiceEnabled || this.isMuted) return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop prior sentence

      // Clean quotation marks, formatting asterisks
      const clean = text.replace(/[*"]/g, '').trim();
      if (!clean) return;

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.volume = this.voiceVolume;

      // Select British voice if available
      const voices = window.speechSynthesis.getVoices();
      const ukVoice = voices.find(v => v.lang === 'en-GB' || v.name.includes('UK') || v.name.includes('British') || v.name.includes('English (United Kingdom)'));
      if (ukVoice) {
        utterance.voice = ukVoice;
      }

      // Persona voice tuning
      switch (voiceType) {
        case 'arthur': // Older Cockney boss, slightly raspy, slow and steady
          utterance.pitch = 0.82;
          utterance.rate = 0.92;
          break;
        case 'dave': // Heavy gruff giant, deep pitch, slow deliberate pace
          utterance.pitch = 0.65;
          utterance.rate = 0.85;
          break;
        case 'dizzy': // Fast-talking energetic Cockney youth
          utterance.pitch = 1.25;
          utterance.rate = 1.18;
          break;
        case 'police': // Stern authoritative constable
          utterance.pitch = 0.95;
          utterance.rate = 1.02;
          break;
        case 'star': // Ethereal chime whisper
          utterance.pitch = 1.45;
          utterance.rate = 0.88;
          break;
        case 'phone': // Filtered phone speaker
          utterance.pitch = 1.1;
          utterance.rate = 1.05;
          break;
        case 'narrator':
        default: // Classic atmospheric British narrator
          utterance.pitch = 0.98;
          utterance.rate = 0.95;
          break;
      }

      this.activeVoices = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      // SpeechSynthesis policy fallback
    }
  }

  public stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // ==========================================
  // ICONIC PS1 & EA BOOT SOUNDS
  // ==========================================
  /**
   * Iconic PS1 Console Startup Chime:
   * 1. Deep sub-bass swell
   * 2. Lush warm synthetic pad chord
   * 3. Sparkling crystalline rising harmonic chime
   * 4. Resonant ethereal reverb tail
   */
  public playPs1Boot() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;

      // 1. Deep Sub-Bass Rumble
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(55, now); // A1
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 4);

      subGain.gain.setValueAtTime(0.01, now);
      subGain.gain.linearRampToValueAtTime(0.6, now + 1.2);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 5.5);

      subOsc.connect(subGain);
      subGain.connect(this.sfxGain);
      subOsc.start(now);
      subOsc.stop(now + 5.5);

      // 2. Majestic Pad Chord (A major 9th: A, C#, E, G#, B)
      const chordNotes = [110.00, 164.81, 220.00, 277.18, 329.63, 415.30, 493.88];
      chordNotes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + 0.3);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(1800, now + 2.5);

        gain.gain.setValueAtTime(0.001, now + 0.2);
        gain.gain.linearRampToValueAtTime(0.12 / chordNotes.length, now + 1.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 6.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + 0.2);
        osc.stop(now + 6.0);
      });

      // 3. High Crystalline Shimmer Bells (The famous PS1 chime)
      const bells = [659.25, 830.61, 987.77, 1318.51, 1661.22, 1975.53, 2637.02];
      bells.forEach((freq, i) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + 1.8 + i * 0.12;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2.2);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(startTime);
        osc.stop(startTime + 2.2);
      });
    } catch {}
  }

  /**
   * EA Sports Parody: "METROPOLITAN GAMES: IT'S IN THE VAULT!"
   */
  public playEAParody() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;

      // Heavy 90s stadium synth brass stab
      const stabFreqs = [146.83, 220.00, 293.66, 369.99, 440.00]; // D major
      stabFreqs.forEach(freq => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.85);
      });

      // Spoken punchline with SpeechSynthesis
      if (this.realVoiceEnabled && 'speechSynthesis' in window) {
        setTimeout(() => {
          this.speakDialogue("Metropolitan Games: It's in the vault.", 'arthur');
        }, 300);
      }
    } catch {}
  }

  // ==========================================
  // RETRO 8-BIT SFX & OVERWORLD AUDIO
  // ==========================================
  public playDialogueBeep(voice: 'narrator' | 'arthur' | 'dave' | 'dizzy' | 'police' | 'phone' | 'star' = 'narrator') {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      let baseFreq = 260;
      let oscType: OscillatorType = 'triangle';
      let duration = 0.045;

      switch (voice) {
        case 'arthur':
          baseFreq = 145 + Math.random() * 20;
          oscType = 'sawtooth';
          duration = 0.05;
          break;
        case 'dave':
          baseFreq = 95 + Math.random() * 15;
          oscType = 'square';
          duration = 0.06;
          break;
        case 'dizzy':
          baseFreq = 390 + Math.random() * 40;
          oscType = 'triangle';
          duration = 0.035;
          break;
        case 'police':
          baseFreq = 210 + Math.random() * 20;
          oscType = 'square';
          duration = 0.055;
          break;
        case 'phone':
          baseFreq = 440;
          oscType = 'sine';
          duration = 0.07;
          break;
        case 'star':
          baseFreq = 880 + Math.random() * 120;
          oscType = 'sine';
          duration = 0.08;
          break;
        case 'narrator':
        default:
          baseFreq = 260 + Math.random() * 15;
          oscType = 'triangle';
          duration = 0.04;
          break;
      }

      osc.type = oscType;
      osc.frequency.setValueAtTime(baseFreq, now);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  }

  public playSelect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(660, now + 0.02);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  public playConfirm() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.06);
      osc.frequency.setValueAtTime(783.99, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {}
  }

  public playFootstep() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;

      // Wet cobblestone puddle splash
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120 + Math.random() * 30, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.04);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  public playSaveTwinkle() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;
      const notes = [587.33, 739.99, 880.00, 1174.66, 1479.98];
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch {}
  }

  public playBattleEncounter() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.25);
      osc.frequency.setValueAtTime(100, now + 0.26);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.24);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch {}
  }

  public playDamage() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;

      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      whiteNoise.start(now);
    } catch {}
  }

  public playPhoneRing() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;
      // Dual-tone UK telephone bell
      [400, 450].forEach(f => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.4);
      });
    } catch {}
  }

  // ==========================================
  // MULTI-TRACK PS1 PROCEDURAL SOUNDTRACK
  // ==========================================
  public playBGM(track: 'menu' | 'tension' | 'chase' | 'sad_ending' | 'heist_quiet' | 'pub' | 'overworld_rain') {
    if (this.currentBgmTrack === track) return;
    this.stopBGM();
    this.currentBgmTrack = track;

    try {
      this.initCtx();
      if (!this.ctx || !this.musicGain) return;

      let tempo = 120;
      let melodyNotes: { pitch: number; dur: number }[] = [];
      let harmonyNotes: { pitch: number; dur: number }[] = [];
      let bassNotes: { pitch: number; dur: number }[] = [];

      const C3 = 130.81, D3 = 146.83, E3 = 164.81, F3 = 174.61, G3 = 196.00, A3 = 220.00, B3 = 246.94;
      const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
      const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00;

      if (track === 'sad_ending') {
        // Heartbreaking Undertale "Memory/His Theme" melancholic progression
        tempo = 66;
        melodyNotes = [
          { pitch: E4, dur: 1 }, { pitch: D4, dur: 1 }, { pitch: B3, dur: 2 },
          { pitch: A3, dur: 1 }, { pitch: B3, dur: 1 }, { pitch: D4, dur: 2 },
          { pitch: E4, dur: 1 }, { pitch: G4, dur: 1 }, { pitch: A4, dur: 2 },
          { pitch: G4, dur: 1 }, { pitch: E4, dur: 1 }, { pitch: D4, dur: 4 },
          { pitch: E4, dur: 1 }, { pitch: D4, dur: 1 }, { pitch: B3, dur: 2 },
          { pitch: A3, dur: 1 }, { pitch: G3, dur: 1 }, { pitch: E3, dur: 4 }
        ];
        harmonyNotes = [
          { pitch: G3, dur: 2 }, { pitch: F3, dur: 2 },
          { pitch: E3, dur: 2 }, { pitch: D3, dur: 2 },
          { pitch: C4, dur: 2 }, { pitch: B3, dur: 2 },
          { pitch: G3, dur: 4 }
        ];
        bassNotes = [
          { pitch: C3, dur: 4 }, { pitch: G3, dur: 4 },
          { pitch: A3, dur: 4 }, { pitch: F3, dur: 4 },
          { pitch: C3, dur: 4 }, { pitch: G3, dur: 4 },
          { pitch: A3, dur: 4 }, { pitch: E3, dur: 4 }
        ];
      } else if (track === 'chase') {
        // High speed 8-bit police pursuit breakbeat
        tempo = 154;
        melodyNotes = [
          { pitch: D4, dur: 0.5 }, { pitch: D4, dur: 0.5 }, { pitch: F4, dur: 0.5 }, { pitch: G4, dur: 0.5 },
          { pitch: A4, dur: 0.5 }, { pitch: G4, dur: 0.5 }, { pitch: F4, dur: 0.5 }, { pitch: D4, dur: 0.5 },
          { pitch: C4, dur: 0.5 }, { pitch: E4, dur: 0.5 }, { pitch: G4, dur: 1 },
          { pitch: D4, dur: 0.5 }, { pitch: F4, dur: 0.5 }, { pitch: A4, dur: 1 }
        ];
        harmonyNotes = [
          { pitch: A3, dur: 1 }, { pitch: Bb3(A3), dur: 1 }, { pitch: C4, dur: 1 }, { pitch: D4, dur: 1 }
        ];
        bassNotes = [
          { pitch: D3, dur: 0.5 }, { pitch: D3, dur: 0.5 }, { pitch: F3, dur: 0.5 }, { pitch: G3, dur: 0.5 }
        ];
      } else if (track === 'pub') {
        // Warm East End pub accordion folk song
        tempo = 112;
        melodyNotes = [
          { pitch: C4, dur: 1 }, { pitch: E4, dur: 1 }, { pitch: G4, dur: 1 }, { pitch: E4, dur: 1 },
          { pitch: F4, dur: 1 }, { pitch: A4, dur: 1 }, { pitch: C5, dur: 2 },
          { pitch: G4, dur: 1 }, { pitch: F4, dur: 1 }, { pitch: E4, dur: 1 }, { pitch: D4, dur: 1 },
          { pitch: C4, dur: 3 }, { pitch: G3, dur: 1 }
        ];
        harmonyNotes = [
          { pitch: E3, dur: 2 }, { pitch: G3, dur: 2 }, { pitch: F3, dur: 2 }, { pitch: A3, dur: 2 }
        ];
        bassNotes = [
          { pitch: C3, dur: 2 }, { pitch: G3, dur: 2 }, { pitch: F3, dur: 2 }, { pitch: C3, dur: 2 }
        ];
      } else if (track === 'tension') {
        // Subterranean vault drill & alarm tension
        tempo = 82;
        melodyNotes = [
          { pitch: D4, dur: 1 }, { pitch: Eb4(D4), dur: 1 }, { pitch: D4, dur: 2 },
          { pitch: Bb3(A3), dur: 1 }, { pitch: C4, dur: 1 }, { pitch: D4, dur: 2 },
          { pitch: F4, dur: 1 }, { pitch: E4, dur: 1 }, { pitch: D4, dur: 2 }
        ];
        harmonyNotes = [
          { pitch: A3, dur: 2 }, { pitch: Bb3(A3), dur: 2 }, { pitch: G3, dur: 2 }, { pitch: A3, dur: 2 }
        ];
        bassNotes = [
          { pitch: D3, dur: 2 }, { pitch: Eb3(D3), dur: 2 }, { pitch: Bb2(A3), dur: 2 }, { pitch: D3, dur: 2 }
        ];
      } else if (track === 'overworld_rain') {
        // Atmospheric rainy 3rd-person exploration noir
        tempo = 78;
        melodyNotes = [
          { pitch: A3, dur: 2 }, { pitch: C4, dur: 2 }, { pitch: E4, dur: 3 }, { pitch: D4, dur: 1 },
          { pitch: C4, dur: 2 }, { pitch: B3, dur: 2 }, { pitch: A3, dur: 4 }
        ];
        harmonyNotes = [
          { pitch: E3, dur: 4 }, { pitch: G3, dur: 4 }, { pitch: F3, dur: 4 }, { pitch: E3, dur: 4 }
        ];
        bassNotes = [
          { pitch: A2(A3), dur: 4 }, { pitch: C3, dur: 4 }, { pitch: D3, dur: 4 }, { pitch: E3, dur: 4 }
        ];
      } else {
        // Nostalgic London drizzle main menu
        tempo = 92;
        melodyNotes = [
          { pitch: D4, dur: 1 }, { pitch: F4, dur: 1 }, { pitch: A4, dur: 2 },
          { pitch: G4, dur: 1 }, { pitch: F4, dur: 1 }, { pitch: E4, dur: 2 },
          { pitch: D4, dur: 1 }, { pitch: E4, dur: 1 }, { pitch: F4, dur: 2 },
          { pitch: C4, dur: 2 }, { pitch: D4, dur: 2 }
        ];
        harmonyNotes = [
          { pitch: F3, dur: 2 }, { pitch: A3, dur: 2 }, { pitch: G3, dur: 2 }, { pitch: F3, dur: 2 }
        ];
        bassNotes = [
          { pitch: D3, dur: 4 }, { pitch: A3, dur: 4 }, { pitch: Bb2(A3), dur: 4 }, { pitch: C3, dur: 4 }
        ];
      }

      function Eb4(f: number) { return f * 1.05946; }
      function Bb3(f: number) { return f * 1.05946; }
      function Eb3(f: number) { return f * 0.5 * 1.05946; }
      function Bb2(f: number) { return f * 0.5 * 1.05946; }
      function A2(f: number) { return f * 0.5; }

      const beatDuration = 60 / tempo;
      let mIndex = 0;
      let hIndex = 0;
      let bIndex = 0;

      const scheduleLoop = () => {
        if (!this.ctx || !this.musicGain || this.isMuted) return;

        const mNote = melodyNotes[mIndex % melodyNotes.length];
        const mNow = this.ctx.currentTime;
        const mDur = mNote.dur * beatDuration;

        // Lead Melodic Synth
        const mOsc = this.ctx.createOscillator();
        const mGain = this.ctx.createGain();

        mOsc.type = track === 'chase' ? 'square' : track === 'pub' ? 'sawtooth' : 'triangle';
        mOsc.frequency.setValueAtTime(mNote.pitch, mNow);

        const mVol = track === 'sad_ending' ? 0.24 : 0.18;
        mGain.gain.setValueAtTime(mVol, mNow);
        mGain.gain.exponentialRampToValueAtTime(0.001, mNow + mDur * 0.95);

        mOsc.connect(mGain);
        mGain.connect(this.musicGain);
        mOsc.start(mNow);
        mOsc.stop(mNow + mDur);

        // Counterpoint Harmony Synth
        if (harmonyNotes.length > 0) {
          const hNote = harmonyNotes[hIndex % harmonyNotes.length];
          const hDur = hNote.dur * beatDuration;
          const hOsc = this.ctx.createOscillator();
          const hGain = this.ctx.createGain();

          hOsc.type = 'sine';
          hOsc.frequency.setValueAtTime(hNote.pitch, mNow);
          hGain.gain.setValueAtTime(0.12, mNow);
          hGain.gain.exponentialRampToValueAtTime(0.001, mNow + hDur * 0.9);

          hOsc.connect(hGain);
          hGain.connect(this.musicGain);
          hOsc.start(mNow);
          hOsc.stop(mNow + hDur);
        }

        // Bass Synth
        const bNote = bassNotes[bIndex % bassNotes.length];
        const bDur = bNote.dur * beatDuration;
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();

        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(bNote.pitch, mNow);
        bGain.gain.setValueAtTime(0.2, mNow);
        bGain.gain.exponentialRampToValueAtTime(0.001, mNow + bDur * 0.9);

        bOsc.connect(bGain);
        bGain.connect(this.musicGain);
        bOsc.start(mNow);
        bOsc.stop(mNow + bDur);

        mIndex++;
        if (mIndex % 2 === 0) {
          hIndex++;
          bIndex++;
        }
      };

      scheduleLoop();
      this.bgmInterval = window.setInterval(scheduleLoop, (beatDuration * 1000));
    } catch {}
  }

  public stopBGM() {
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.currentBgmTrack = null;
  }
}

export const audio = new RetroAudioEngine();

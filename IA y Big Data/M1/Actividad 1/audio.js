/**
 * AM: PROJECT PROTOCOL - MOTOR DE SÍNTESI D'ÀUDIO WEB AUDIO API
 * Generació procedural de paisatges sonors retro-futuristes i efectes d'AM
 * sense dependències d'arxius externs (100% autònom i instantani).
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.ambientGain = null;
        this.droneOsc = null;
        this.droneOsc2 = null;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();
        this.isInitialized = true;
        this.startAmbientDrone();
    }

    startAmbientDrone() {
        if (!this.ctx || this.isMuted) return;

        try {
            // Oscil·lador de greus profunds per simular el monòlit d'AM
            this.droneOsc = this.ctx.createOscillator();
            this.droneOsc2 = this.ctx.createOscillator();
            const filter = this.ctx.createBiquadFilter();
            this.ambientGain = this.ctx.createGain();

            this.droneOsc.type = 'sawtooth';
            this.droneOsc.frequency.setValueAtTime(48, this.ctx.currentTime); // Sub-bass

            this.droneOsc2.type = 'sine';
            this.droneOsc2.frequency.setValueAtTime(52, this.ctx.currentTime); // Beat frequency

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(140, this.ctx.currentTime);

            this.ambientGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

            this.droneOsc.connect(filter);
            this.droneOsc2.connect(filter);
            filter.connect(this.ambientGain);
            this.ambientGain.connect(this.ctx.destination);

            this.droneOsc.start();
            this.droneOsc2.start();
        } catch (e) {
            console.log("Audio autostart bloquejat pel navegador, s'activarà amb el primer clic.", e);
        }
    }

    playClick() {
        if (!this.ctx || this.isMuted) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
    }

    playAlert() {
        if (!this.ctx || this.isMuted) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(440, this.ctx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    playAmWrath() {
        if (!this.ctx || this.isMuted) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        // Sinister chord descent
        [180, 190, 90].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + 0.8);

            gain.gain.setValueAtTime(0.08, this.ctx.currentTime + (idx * 0.05));
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.9);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + (idx * 0.05));
            osc.stop(this.ctx.currentTime + 0.95);
        });
    }

    playVictory() {
        if (!this.ctx || this.isMuted) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        [440, 554, 659, 880].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (idx * 0.12));
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime + (idx * 0.12));
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (idx * 0.12) + 0.5);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + (idx * 0.12));
            osc.stop(this.ctx.currentTime + (idx * 0.12) + 0.5);
        });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.ambientGain) {
            this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime);
        }
        return this.isMuted;
    }
}

export const sound = new SoundEngine();

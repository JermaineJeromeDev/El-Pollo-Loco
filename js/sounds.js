/**
 * Sound manager for all audio files
 * @namespace SoundManager
 */
const SoundManager = {
    sounds: {},

    /**
     * Loads a sound
     * @param {string} name - Name of the sound
     * @param {Array<{src: string, type: string}>} sources - Audio sources
     */
    load(name, sources) {
        if (this.sounds[name]) return;
        let audio = new Audio();
        sources.forEach(srcObj => {
            let source = document.createElement('source');
            source.src = srcObj.src;
            source.type = srcObj.type;
            audio.appendChild(source);
        });
        audio.preload = 'auto';
        this.sounds[name] = audio;
    },

    /**
     * Plays a sound
     * @param {string} name - Name of the sound
     * @param {number} volume - Volume (0-1)
     * @param {boolean} allowOverlap - Allow multiple instances
     */
    play(name, volume = 1, allowOverlap = true) {
        if (gameIsMuted) return;
        let audio = this.sounds[name];
        if (!audio) return;

        if (!allowOverlap) {
            if (!audio.paused) return;
            audio.currentTime = 0;
            audio.volume = volume;
            audio.play();
        } else {
            let clone = audio.cloneNode(true);
            clone.volume = volume;
            if (typeof clone.load === 'function') clone.load();
            clone.play();
        }
    },

    /**
     * Plays a predefined sound with preset volume and overlap settings.
     * This is a convenience method that calls the main play() function with specific       parameters.
     * Available sounds: jump, throw, break, hurt, win, lose, coin
     */
    playJump() { this.play('jump', 0.2, true); },
    playThrow() { this.play('throw', 0.3, true); },
    playBreak() { this.play('break', 0.4, true); },
    playHurt() { this.play('hurt', 0.15, false); },
    playWin() { this.play('win', 0.3, false); },
    playLose() { this.play('lose', 0.3, false); },
    playCoin() { this.play('coin', 0.25, true); },

    /**
     * Starts gameplay loop sound
     */
    playGameplay() {
        if (gameIsMuted) return;
        let audio = this.sounds['gameplay'];
        if (!audio) return;
        audio.loop = true;
        audio.volume = 0.15;
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {});
        }
    },

    /**
     * Stops gameplay sound
     */
    stopGameplay() {
        let audio = this.sounds['gameplay'];
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
    },

    /**
     * Pauses gameplay sound (without reset)
     */
    pauseGameplay() {
        let audio = this.sounds['gameplay'];
        if (!audio) return;
        audio.pause();
    },

    /**
     * Resumes gameplay sound
     */
    resumeGameplay() {
        if (gameIsMuted) return;
        let audio = this.sounds['gameplay'];
        if (!audio) return;
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {});
        }
    },

    /**
     * Stops all sounds
     */
    stopAll() {
        Object.values(this.sounds).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    },

    /**
     * Pauses all sounds (without reset)
     */
    pauseAll() {
        Object.values(this.sounds).forEach(audio => {
            if (!audio.paused) {
                audio.pause();
                audio._wasPausedBySystem = true;
            }
        });
    },

    /**
     * Resumes all previously paused sounds
     */
    resumeAll() {
        if (gameIsMuted) return;
        Object.values(this.sounds).forEach(audio => {
            if (audio._wasPausedBySystem) {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {});
                }
                delete audio._wasPausedBySystem;
            }
        });
    },

    /**
     * Mutes all sounds
     */
    muteAll() {
        Object.values(this.sounds).forEach(audio => {
            audio.muted = true;
        });
    },

    /**
     * Unmutes all sounds
     */
    unmuteAll() {
        Object.values(this.sounds).forEach(audio => {
            audio.muted = false;
        });
    }
};

/**
 * Loads the coin collection sound effect.
 * The sound is loaded from a WAV file and can be played when the player collects a coin.
 */
SoundManager.load('coin', [{ src: 'assets/audio/3_coin/collect.wav', type: 'audio/wav' }]);
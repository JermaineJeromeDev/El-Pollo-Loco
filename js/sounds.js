/**
 * Sound-Manager für alle Audio-Dateien
 * @namespace SoundManager
 */
const SoundManager = {
    sounds: {},

    /**
     * Lädt einen Sound
     * @param {string} name - Name des Sounds
     * @param {Array<{src: string, type: string}>} sources - Audio-Quellen
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
     * Spielt einen Sound ab
     * @param {string} name - Name des Sounds
     * @param {number} volume - Lautstärke (0-1)
     * @param {boolean} allowOverlap - Erlaube mehrere Instanzen
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

    /** Spielt Jump-Sound */
    playJump() { this.play('jump', 0.5, true); },
    
    /** Spielt Throw-Sound */
    playThrow() { this.play('throw', 0.6, true); },
    
    /** Spielt Break-Sound */
    playBreak() { this.play('break', 0.7, true); },
    
    /** Spielt Hurt-Sound */
    playHurt() { this.play('hurt', 0.3, false); },
    
    /** Spielt Win-Sound */
    playWin() { this.play('win', 0.5, false); },
    
    /** Spielt Lose-Sound */
    playLose() { this.play('lose', 0.5, false); },
    
    /** Spielt Coin-Sound */
    playCoin() { this.play('coin', 0.5, true); },

    /**
     * Startet Gameplay-Loop-Sound
     */
    playGameplay() {
        if (gameIsMuted) return;
        let audio = this.sounds['gameplay'];
        if (!audio) return;
        audio.loop = true;
        audio.volume = 0.3;
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {});
        }
    },

    /**
     * Stoppt Gameplay-Sound
     */
    stopGameplay() {
        let audio = this.sounds['gameplay'];
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
    },

    /**
     * Stoppt alle Sounds
     */
    stopAll() {
        Object.values(this.sounds).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }
};

SoundManager.load('coin', [{ src: 'assets/audio/3_coin/collect.wav', type: 'audio/wav' }]);



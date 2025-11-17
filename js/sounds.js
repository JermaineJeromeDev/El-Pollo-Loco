const SoundManager = {
    sounds: {},

    /**
     * Lädt einen Sound unter einem bestimmten Namen
     * @param {string} name 
     * @param {Array} sources [{src: 'path', type: 'audio/mpeg'}]
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
     * Allgemeines Abspielen eines Sounds
     * @param {string} name 
     * @param {number} volume 0-1
     * @param {boolean} allowOverlap ob mehrere Instanzen gleichzeitig laufen dürfen
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
            // clone inkl. Kinder (deep clone), lade Quellen und spiele
            let clone = audio.cloneNode(true);
            clone.volume = volume;
            if (typeof clone.load === 'function') clone.load();
            clone.play();
        }
    },

    playJump() { this.play('jump', 0.5, true); },
    playThrow() { this.play('throw', 0.6, true); },
    playBreak() { this.play('break', 0.7, true); },
    playHurt() { this.play('hurt', 0.3, false); },
    playWin() { this.play('win', 0.5, false); },
    playLose() { this.play('lose', 0.5, false); },
    playCoin() { this.play('coin', 0.5, true); },

    // Gameplay-Loop Sound
    playGameplay() {
        if (gameIsMuted) return;
        let audio = this.sounds['gameplay'];
        if (!audio) return;
        audio.loop = true;
        audio.volume = 0.3;
        audio.play();
    },

    stopGameplay() {
        let audio = this.sounds['gameplay'];
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
    },

    stopAll() {
        Object.values(this.sounds).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }
};

// Sound laden (z.B. beim Spielstart)
SoundManager.load('coin', [{ src: 'assets/audio/3_coin/collect.wav', type: 'audio/wav' }]);



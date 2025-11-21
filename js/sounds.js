/**
 * sounds.js
 *
 * SoundManager: Centralized management for all game audio.
 * - Loads, plays, pauses, resumes, mutes, and stops individual or all sounds.
 * - Handles gameplay background music and sound effects.
 * - Supports overlapping sounds and system-paused sound resuming.
 * - Designed to respect game mute state and handle promise rejections gracefully.
 */

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
     * Plays the gameplay background sound if the game is not muted.
     * The sound is set to loop and its volume is adjusted.
     * Handles any errors that may occur when attempting to play the audio.
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
     * Stops the gameplay sound by pausing the audio and resetting its playback position to the start.
     * If the gameplay sound is not found, the function does nothing.
     */
    stopGameplay() {
        let audio = this.sounds['gameplay'];
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
    },

    /**
     * Pauses the gameplay audio if it is currently playing.
     * Checks if the 'gameplay' sound exists before attempting to pause.
     */
    pauseGameplay() {
        let audio = this.sounds['gameplay'];
        if (!audio) return;
        audio.pause();
    },

    /**
     * Resumes the gameplay sound if the game is not muted.
     * Attempts to play the 'gameplay' audio from the sounds collection.
     * Handles any play promise rejections silently.
     *
     * @returns {void}
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
     * Stops and resets all audio elements in the `sounds` collection.
     * Pauses each audio and sets its playback position to the beginning.
     */
    stopAll() {
        Object.values(this.sounds).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    },

    /**
     * Pauses all currently playing audio objects in the `sounds` collection.
     * Sets a custom flag `_wasPausedBySystem` to `true` on each audio object that was paused.
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
     * Resumes playback of all sounds that were previously paused by the system,
     * unless the game is currently muted. Only sounds marked with `_wasPausedBySystem`
     * are resumed. Handles promise rejections silently.
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
     * Mutes all audio elements stored in the `sounds` object.
     * Iterates through each audio object and sets its `muted` property to `true`.
     */
    muteAll() {
        Object.values(this.sounds).forEach(audio => {
            audio.muted = true;
        });
    },

    /**
     * Unmutes all audio elements stored in the `sounds` object.
     * Iterates through each sound and sets its `muted` property to `false`.
     */
    unmuteAll() {
        Object.values(this.sounds).forEach(audio => {
            audio.muted = false;
        });
    }
};

/**
 * Stops all currently playing game sounds using the SoundManager, if available.
 *
 * Checks if the SoundManager is defined and calls its stopAll method to halt all audio playback.
 */
function stopAllGameSounds() {
    if (typeof SoundManager !== 'undefined') {
        SoundManager.stopAll();
    }
}

/**
 * Loads the coin collection sound effect.
 * The sound is loaded from a WAV file and can be played when the player collects a coin.
 */
SoundManager.load('coin', [{ src: 'assets/audio/3_coin/collect.wav', type: 'audio/wav' }]);
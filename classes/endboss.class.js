/**
 * Represents the endboss enemy
 * @class Endboss
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    offset = {
        top: 90,
        bottom: 40,
        left: 24,
        right: 20
    }

    IMAGES_ALERT = [
        'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_WALKING = [
        'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ATTACK = [
        'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    alertSound;
    hurtSound;
    audioArrayEndboss = []; 
    alertPlayed = false;
    alertAnimationDone = false;
    alertAnimationIndex = 0;
    activated = false;
    deadAnimationPlayed = false;
    deadAnimationFrame = 0;

    /**
     * Creates an instance of Endboss.
     * Initializes images, sounds, dimensions, position, speed, and starts animation.
     *
     * @constructor
     */
    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.initSounds();
        this.height = 450;
        this.width = 300;
        this.y = 0;
        this.x = 2550;
        this.speed = 0.8;
        this.animate();
    }

    /**
     * Initializes the endboss sound effects by creating and loading audio objects
     * for alert and hurt sounds, then adds them to the audio array.
     * Handles errors gracefully if sounds cannot be loaded.
     */
    initSounds() {
        try {
            this.alertSound = new Audio('assets/audio/2_chicken/chicken_single_alarm.mp3');
            this.hurtSound = new Audio('assets/audio/2_chicken/chicken_single_alarm.mp3');
            this.alertSound.load();
            this.hurtSound.load();
            this.audioArrayEndboss.push(this.alertSound, this.hurtSound);
        } catch (error) {
            console.warn('Endboss sounds could not be loaded:', error);
        }
    }

    /**
     * Sets the current world for the endboss.
     * @param {World} world - The world object to associate with the endboss.
     */
    setWorld(world) {
        this.world = world;
    }

    /**
     * Starts the animation for the endboss character.
     * Initializes intervals to update the character's state and movement.
     * - Calls `updateState()` every 120 milliseconds to handle animation frames.
     * - Calls `moveIfNeeded()` approximately 60 times per second to handle movement.
     * Sets `deadAnimationInterval` to null before starting the intervals.
     */
    animate() {
        this.deadAnimationInterval = null;
        setInterval(() => this.updateState(), 120);
        setInterval(() => this.moveIfNeeded(), 1000 / 60);
    }

    /**
     * Updates the state of the Endboss character based on current game conditions.
     * - Pauses updates if the game is paused.
     * - Handles dead and hurt states.
     * - Triggers alert animation if the player is near and alert animation is not done.
     * - Activates Endboss behavior if alert animation is done or Endboss is activated.
     * - Updates the Endboss status bar.
     */
    updateState() {
        if (this.world && this.world.gamePaused) return;
        if (this.isDead()) return this.handleDead();
        if (this.isHurtEndboss()) {
            this.activated = true;
            return this.handleHurt();
        }
        if ((!this.alertAnimationDone && this.isPlayerNear()) || this.activated) {
            if (!this.alertAnimationDone) return this.handleAlert();
            this.handleActive();
        }
        this.updateStatusBar();
    }

    /**
     * Updates the endboss status bar to reflect the current energy level.
     * If the status bar exists, sets its percentage based on the endboss's energy.
     */
    updateStatusBar() {
        if (this.statusBarEndboss) {
            this.statusBarEndboss.setPercentage(this.energy);
        }
    }

    /**
     * Checks if the endboss should move based on its current state and the game's pause status.
     * Movement is only handled if the endboss is not dead, not hurt, and either the alert animation is done or it is activated.
     * If the game is paused, movement is skipped.
     */
    moveIfNeeded() {
        if (this.world && this.world.gamePaused) return;
        if (!this.isDead() && !this.isHurt() && (this.alertAnimationDone || this.activated)) {
            this.handleMovement();
        }
    }

    /**
     * Handles the logic when the endboss dies.
     * Sets the speed to zero and plays the dead animation if it hasn't been played yet.
     */
    handleDead() {
        this.speed = 0;
        if (!this.deadAnimationPlayed) this.playDeadAnimationLooped(3);
    }

    /**
     * Handles the endboss being hurt by stopping movement, playing the hurt animation, and playing the hurt sound.
     */
    handleHurt() {
        this.speed = 0;
        this.playAnimation(this.IMAGES_HURT);
        this.playHurtSound();
    }

    /**
     * Handles the alert state for the endboss.
     * Sets the speed to zero, plays the alert animation, activates the endboss,
     * and initializes the status bar if it does not exist.
     */
    handleAlert() {
        this.speed = 0;
        this.playAlertAnimation();
        this.activated = true;
        if (!this.statusBarEndboss) this.statusBarEndboss = new StatusBarEndboss();
    }

    /**
     * Activates the endboss by setting alert and activation flags,
     * then initiates movement and animation handling.
     */
    handleActive() {
        this.alertAnimationDone = true;
        this.activated = true;
        this.handleMovementAndAnimation();
    }

    /**
     * Handles the movement logic for the endboss character.
     * Currently, this method moves the character to the left.
     */
    handleMovement() {
        this.moveLeft();
    }

    /**
     * Handles the movement speed and animation state of the endboss based on the character's position.
     * - If the character is within 500 units to the left, the endboss attacks.
     * - If the character is within 300 units to the left, the endboss is alert.
     * - Otherwise, the endboss walks.
     *
     * @returns {void}
     */
    handleMovementAndAnimation() {
        if (this.world.character.x > this.x - 500) {
            this.speed = 2;
            this.playAnimation(this.IMAGES_ATTACK);
        } else if (this.world.character.x > this.x - 300) {
            this.speed = 0.8;
            this.playAnimation(this.IMAGES_ALERT);
        } else {
            this.speed = 0.4;
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Plays the dead animation for the endboss character in a loop for a specified number of times.
     * Sets the `deadAnimationPlayed` flag to true and uses the configured frame count and duration.
     *
     * @param {number} [loopCount=3] - The number of times to loop the dead animation.
     */
    playDeadAnimationLooped(loopCount = 3) {
        this.deadAnimationPlayed = true;
        const config = { frames: this.IMAGES_DEAD.length, frameDuration: 120 };
        playDeadLoop(this, config, loopCount);
    }

    /**
     * Checks if the player character is within a certain range of the endboss.
     * The range is defined as being between (endboss.x - 300) and (endboss.x + 1000).
     *
     * @returns {boolean} True if the player is near the endboss, false otherwise.
     */
    isPlayerNear() {
        return this.world && this.world.character.x > this.x - 300 && this.world.character.x < this.x + 1000;
    }

    /**
     * Checks if the endboss character is currently hurt.
     * Delegates to the `isHurt` method.
     * @returns {boolean} True if the endboss is hurt, otherwise false.
     */
    isHurtEndboss() {
        return this.isHurt();
    }

    /**
     * Plays the alert animation for the endboss character.
     * If the alert sound has not been played yet, it plays the sound and marks it as played.
     * Advances the alert animation frame and checks if the animation is complete.
     * Stops the alert sound when the animation finishes.
     *
     * @returns {void}
     */
    playAlertAnimation() {
        if (!this.alertPlayed) {
            this.playAlertSound();
            this.alertPlayed = true;
        }
        this.playAnimation(this.IMAGES_ALERT);
        this.alertAnimationIndex++;
        if (this.alertAnimationIndex >= this.IMAGES_ALERT.length) {
            this.alertAnimationDone = true;
            this.stopAlertSound();
        }
    }

    /**
     * Plays the alert sound for the endboss character if the game is not muted.
     * Resets the sound to the beginning, unmutes it, sets the volume and playback rate,
     * and then plays the sound.
     *
     * @returns {void}
     */
    playAlertSound() {
        const muted = (this.world && this.world.gameIsMuted) || 
                    (typeof gameIsMuted !== 'undefined' && gameIsMuted);
        if (muted) return;
        this.alertSound.currentTime = 0;
        this.alertSound.muted = false;
        this.alertSound.volume = 0.1;  // 0.2 → 0.1
        this.alertSound.playbackRate = 1.2;
        this.alertSound.play();
    }

    /**
     * Stops the alert sound by pausing it and resetting its playback position to the start.
     */
    stopAlertSound() {
        this.alertSound.pause();
        this.alertSound.currentTime = 0;
    }

    /**
     * Plays the hurt sound effect for the endboss character.
     * The sound will only play if the game is not muted and the sound is currently paused.
     * Resets the sound to the beginning, unmutes it, sets the volume and playback rate, then plays it.
     *
     * @returns {void}
     */
    playHurtSound() {
        const muted = (this.world && this.world.gameIsMuted) || 
                    (typeof gameIsMuted !== 'undefined' && gameIsMuted);
        if (muted || !this.hurtSound.paused) return;
        this.hurtSound.currentTime = 0;
        this.hurtSound.muted = false;
        this.hurtSound.volume = 0.1;  
        this.hurtSound.playbackRate = 1.2;
        this.hurtSound.play();
    }

    /**
     * Reduces the endboss's energy by 20 points when hit.
     * Ensures energy does not drop below zero.
     * Updates the last hit timestamp and refreshes the endboss's status bar if available.
     */
    hit() {
        this.energy -= 20;
        if (this.energy < 0) this.energy = 0;
        this.lastHit = new Date().getTime();
        if (this.statusBarEndboss) {
            this.statusBarEndboss.setPercentage(this.energy);
        }
    }
}

/**
 * Plays dead animation loop
 * @param {Endboss} endboss - Endboss instance
 * @param {Object} config - Animation config
 * @param {number} loopCount - Loop count
 */
function playDeadLoop(endboss, config, loopCount) {
    let frame = 0;
    let loops = 0;
    endboss.deadAnimationInterval = setInterval(() => {
        updateEndbossDeadFrame(endboss, frame);
        frame++;
        if (frame >= config.frames) {
            frame = 0;
            loops++;
        }
        if (shouldEndDeadLoop(loops, loopCount)) {
            clearInterval(endboss.deadAnimationInterval);
            handleEndbossWin(endboss);
        }
    }, config.frameDuration);
}

/**
 * Updates the endboss dead animation frame
 */
function updateEndbossDeadFrame(endboss, frame) {
    let path = endboss.IMAGES_DEAD[frame];
    endboss.img = endboss.imageCache[path];
}

/**
 * Checks if dead loop should end
 */
function shouldEndDeadLoop(loops, loopCount) {
    return loops >= loopCount;
}

/**
 * Handles win screen after endboss dead animation
 */
function handleEndbossWin(endboss) {
    if (endboss.world) {
        setTimeout(() => {
            endboss.world.showWinScreen();
            if (endboss.world.stopGame) endboss.world.stopGame();
        }, 300);
    }
}
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
    audioArrayEndboss = []; // WICHTIG: Initialisierung HIER, nicht später

    alertPlayed = false;
    alertAnimationDone = false;
    alertAnimationIndex = 0;
    activated = false;
    deadAnimationPlayed = false;
    deadAnimationFrame = 0;

    /**
     * Creates a new endboss instance
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
     * Initializes audio files
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
     * Sets the world reference for the endboss
     * @param {World} world - The game world instance
     */
    setWorld(world) {
        this.world = world;
    }

    /**
     * Initializes animation and movement intervals
     */
    animate() {
        this.deadAnimationInterval = null;
        setInterval(() => this.updateState(), 120);
        setInterval(() => this.moveIfNeeded(), 1000 / 60);
    }

    /**
     * Updates the endboss state based on current conditions
     */
    updateState() {
        if (this.isDead()) return this.handleDead();
        if (this.isHurtEndboss()) return this.handleHurt();
        if (!this.alertAnimationDone && this.isPlayerNear()) return this.handleAlert();
        if (this.alertAnimationDone || this.activated) this.handleActive();
        
        this.updateStatusBar();
    }

    /**
     * Updates the status bar with current energy
     */
    updateStatusBar() {
        if (this.statusBarEndboss) {
            this.statusBarEndboss.setPercentage(this.energy);
        }
    }

    /**
     * Moves the endboss if conditions are met
     */
    moveIfNeeded() {
        if (!this.isDead() && !this.isHurt() && (this.alertAnimationDone || this.activated)) {
            this.handleMovement();
        }
    }

    /**
     * Handles endboss death state
     */
    handleDead() {
        this.speed = 0;
        if (!this.deadAnimationPlayed) this.playDeadAnimationLooped(3);
    }

    /**
     * Handles endboss hurt state
     */
    handleHurt() {
        this.speed = 0;
        this.playAnimation(this.IMAGES_HURT);
        this.playHurtSound();
    }

    /**
     * Handles endboss alert state when player is near
     */
    handleAlert() {
        this.speed = 0;
        this.playAlertAnimation();
        this.activated = true;
        if (!this.statusBarEndboss) this.statusBarEndboss = new StatusBarEndboss();
    }

    /**
     * Handles endboss active state after alert
     */
    handleActive() {
        this.alertAnimationDone = true;
        this.activated = true;
        this.handleMovementAndAnimation();
    }

    /**
     * Handles endboss movement
     */
    handleMovement() {
        this.moveLeft();
    }

    /**
     * Handles movement and animation based on player distance
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
     * Plays dead animation in loop
     * @param {number} loopCount - Number of animation loops
     */
    playDeadAnimationLooped(loopCount = 3) {
        this.deadAnimationPlayed = true;
        const config = { frames: this.IMAGES_DEAD.length, frameDuration: 120 };
        playDeadLoop(this, config, loopCount);
    }

    /**
     * Checks if player is near the endboss
     * @returns {boolean} True if player is within detection range
     */
    isPlayerNear() {
        return this.world && this.world.character.x > this.x - 300 && this.world.character.x < this.x + 1000;
    }

    /**
     * Checks if endboss is hurt
     * @returns {boolean}
     */
    isHurtEndboss() {
        return this.isHurt();
    }

    /**
     * Plays alert animation with sound
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
     * Plays alert sound if not muted
     */
    playAlertSound() {
        const muted = (this.world && this.world.gameIsMuted) || 
                    (typeof gameIsMuted !== 'undefined' && gameIsMuted);
        if (muted) return;
        this.alertSound.currentTime = 0;
        this.alertSound.muted = false;
        this.alertSound.volume = 0.2;
        this.alertSound.playbackRate = 1.2;
        this.alertSound.play();
    }

    /**
     * Stops the alert sound
     */
    stopAlertSound() {
        this.alertSound.pause();
        this.alertSound.currentTime = 0;
    }

    /**
     * Plays hurt sound if not muted
     */
    playHurtSound() {
        const muted = (this.world && this.world.gameIsMuted) || 
                    (typeof gameIsMuted !== 'undefined' && gameIsMuted);
        if (muted || !this.hurtSound.paused) return;
        this.hurtSound.currentTime = 0;
        this.hurtSound.muted = false;
        this.hurtSound.volume = 0.2;
        this.hurtSound.playbackRate = 1.2;
        this.hurtSound.play();
    }

    /**
     * Reduces endboss energy and updates status bar
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

// Helper functions AUSSERHALB der Class
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
        let path = endboss.IMAGES_DEAD[frame];
        endboss.img = endboss.imageCache[path];
        frame++;
        
        if (frame >= config.frames) {
            frame = 0;
            loops++;
        }
        
        if (loops >= loopCount) {
            clearInterval(endboss.deadAnimationInterval);
            if (endboss.world) {
                setTimeout(() => {
                    endboss.world.showWinScreen();
                    if (endboss.world.stopGame) endboss.world.stopGame();
                }, 300);
            }
        }
    }, config.frameDuration);
}

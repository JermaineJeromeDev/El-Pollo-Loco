/**
 * Represents the main playable character
 * @class Character
 * @extends MovableObject
 */
class Character extends MovableObject {
    x = 50;
    y = 160;
    width = 130;
    height = 280;
    
    speed = 10;
    world;
    idleTime = 0;
    loseScreenShown = false;
    deadAnimationPlayed = false;
    hurtCooldown = false;

    IMAGES_WALKING = [
        'assets/img/2_character_pepe/2_walk/W-21.png',
        'assets/img/2_character_pepe/2_walk/W-22.png',
        'assets/img/2_character_pepe/2_walk/W-23.png',
        'assets/img/2_character_pepe/2_walk/W-24.png',
        'assets/img/2_character_pepe/2_walk/W-25.png',
        'assets/img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'assets/img/2_character_pepe/3_jump/J-31.png',
        'assets/img/2_character_pepe/3_jump/J-32.png',
        'assets/img/2_character_pepe/3_jump/J-33.png',
        'assets/img/2_character_pepe/3_jump/J-34.png',
        'assets/img/2_character_pepe/3_jump/J-35.png',
        'assets/img/2_character_pepe/3_jump/J-36.png',
        'assets/img/2_character_pepe/3_jump/J-37.png',
        'assets/img/2_character_pepe/3_jump/J-38.png',
        'assets/img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_IDLE = [
        'assets/img/2_character_pepe/1_idle/idle/I-1.png',
        'assets/img/2_character_pepe/1_idle/idle/I-2.png',
        'assets/img/2_character_pepe/1_idle/idle/I-3.png',
        'assets/img/2_character_pepe/1_idle/idle/I-4.png',
        'assets/img/2_character_pepe/1_idle/idle/I-5.png',
        'assets/img/2_character_pepe/1_idle/idle/I-6.png',
        'assets/img/2_character_pepe/1_idle/idle/I-7.png',
        'assets/img/2_character_pepe/1_idle/idle/I-8.png',
        'assets/img/2_character_pepe/1_idle/idle/I-9.png',
        'assets/img/2_character_pepe/1_idle/idle/I-10.png',
    ];

    IMAGES_LONG_IDLE = [
        'assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];

    IMAGES_HURT = [
        'assets/img/2_character_pepe/4_hurt/H-41.png',
        'assets/img/2_character_pepe/4_hurt/H-42.png',
        'assets/img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_DEAD = [
        'assets/img/2_character_pepe/5_dead/D-51.png',
        'assets/img/2_character_pepe/5_dead/D-52.png',
        'assets/img/2_character_pepe/5_dead/D-53.png',
        'assets/img/2_character_pepe/5_dead/D-54.png',
        'assets/img/2_character_pepe/5_dead/D-55.png',
        'assets/img/2_character_pepe/5_dead/D-56.png',
        'assets/img/2_character_pepe/5_dead/D-57.png'
    ];

    offset = {
        top: 50,
        bottom: 10,
        left: 30,
        right: 30
    }

    /**
     * Creates a new Character instance.
     * Initializes the character by loading all animation images (walking, jumping, idle, long idle, hurt, and dead states),
     * applying gravity physics, and starting the animation cycle.
     * 
     * @constructor
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.applyGravity();
        this.animate();
    }

    /**
     * Initializes and starts all character-related animations and controls.
     * Triggers movement handling and continuous animation updates.
     *
     * @returns {void}
     */
    animate() {
        this.controlCharacter();
        this.animateCharacter();
    }


    /**
     * Starts the character control loop.
     * Handles movement, jumping and updates the camera position.
     * Pauses execution automatically when the game is paused or the character is dead.
     *
     * @returns {void}
     */
    controlCharacter() {
        setInterval(() => {
            if (this.world && this.world.gamePaused) return;
            if (this.isDead()) return;
            this.handleMovement();
            this.handleJump();
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);
    }

    /**
     * Processes horizontal movement based on keyboard input.
     * Moves the character left or right within the level boundaries and
     * resets idle time whenever movement occurs.
     *
     * @returns {void}
     */
    handleMovement() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            this.idleTime = 0;
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            this.idleTime = 0;
        }
    }

    /**
     * Handles jump input and triggers a jump if the character is on the ground.
     * Prevents repeated jumping while airborne.
     *
     * @returns {void}
     */
    handleJump() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
        }
    }

    /**
     * Starts the character animation update loop.
     * Periodically evaluates the character state and updates the
     * corresponding animation. Automatically pauses when the game is paused.
     *
     * @returns {void}
     */
    animateCharacter() {
        setInterval(() => {
            if (this.world && this.world.gamePaused) return;
            this.updateCharacterState();
        }, 200);
    }

    /**
     * Determines and applies the current character animation based on its state.
     * Evaluates conditions in priority order (death, hurt, jump, walk)
     * and triggers the corresponding animation handler. Defaults to idle animation.
     *
     * @returns {void}
     */
    updateCharacterState() {
        if (this.shouldPlayDeathAnimation()) {
            this.playDeadAnimationAndLose();
        } else if (this.shouldPlayHurtAnimation()) {
            this.handleHurtAnimation();
        } else if (this.shouldPlayJumpAnimation()) {
            this.handleJumpingAnimation();
        } else if (this.shouldPlayWalkAnimation()) {
            this.handleWalkingAnimation();
        } else {
            this.handleIdleAnimation();
        }
    }

    /**
     * Determines whether the death animation should be triggered.
     * Returns true if the character is dead and the death animation
     * has not been played yet.
     *
     * @returns {boolean} True if the death animation should start.
     */
    shouldPlayDeathAnimation() {
        return this.isDead() && !this.deadAnimationPlayed;
    }

    /**
     * Checks if hurt animation should play
     * @returns {boolean}
     */
    shouldPlayHurtAnimation() {
        return this.isHurt() && !this.loseScreenShown;
    }

    /**
     * Checks if jump animation should play
     * @returns {boolean}
     */
    shouldPlayJumpAnimation() {
        if (this.isAboveGround()) {
            this.idleTime = 0;
            return true;
        }
        return false;
    }

    /**
     * Checks if walk animation should play
     * @returns {boolean}
     */
    shouldPlayWalkAnimation() {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.idleTime = 0;
            return true;
        }
        return false;
    }

    /**
     * Handles hurt animation
     */
    handleHurtAnimation() {
        this.playAnimation(this.IMAGES_HURT);
        this.playHurtSound();
    }

    /**
     * Plays the hurt sound effect if sound is enabled and no hurt sound
     * is currently playing. Prevents overlapping audio by using a cooldown.
     *
     * @returns {void}
     */
    playHurtSound() {
        if (this._hurtSoundPlaying || this.world.gameIsMuted) return;
        
        this._hurtSoundPlaying = true;
        SoundManager.play('hurt', 0.15, false); 
        setTimeout(() => { this._hurtSoundPlaying = false; }, 500);
    }

    /**
     * Updates the character's animation to the jumping sequence.
     * Resets idle time whenever a jump animation is played.
     *
     * @returns {void}
     */
    handleJumpingAnimation() {
        this.playAnimation(this.IMAGES_JUMPING);
        this.idleTime = 0;
    }

    /**
     * Updates the character's animation to the walking sequence.
     * Resets idle time whenever a walking animation is played.
     *
     * @returns {void}
     */
    handleWalkingAnimation() {
        this.playAnimation(this.IMAGES_WALKING);
        this.idleTime = 0;
    }

    /**
     * Updates the character's idle animation based on the current idle time.
     * Switches to a long idle animation if the character has been idle for an extended period.
     *
     * @returns {void}
     */
    handleIdleAnimation() {
        this.idleTime++;
        if (this.idleTime > 150) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }

    /**
     * Plays the character's death animation and then triggers the lose screen.
     * Marks the death animation as played to prevent it from being triggered again.
     *
     * @returns {void}
     */
    playDeadAnimationAndLose() {
        this.deadAnimationPlayed = true;
        this.playDeadAnimation(() => {
            this.handleLoseScreen();
        });
    }

    /**
     * Plays the death animation sequence
     * @param {Function} callback - Callback after animation completes
     */
    playDeadAnimation(callback) {
        let frames = this.IMAGES_DEAD.length;
        let frameDuration = 250; 
        let frame = 0;
        let interval = setInterval(() => {
            this.img = this.imageCache[this.IMAGES_DEAD[frame]];
            frame++;
            if (frame >= frames) {
                clearInterval(interval);
                if (typeof callback === 'function') callback();
            }
        }, frameDuration);
    }

    /**
     * Handles the lose screen logic for the character.
     * Plays the lose sound if the game is not muted, and after a short delay,
     * stops the game and displays the lose screen if the appropriate method exists.
     *
     * @returns {void}
     */
    handleLoseScreen() {
        if (this.world && !this.loseScreenShown) {
            this.loseScreenShown = true;
            if (!this.world.gameIsMuted) SoundManager.play('lose');
            setTimeout(() => {
                if (typeof this.world.showLoseScreen === 'function') {
                    this.world.stopGame();
                    this.world.showLoseScreen();
                }
            }, 400);
        }
    }

    /**
     * Initiates the character's jump by setting the vertical speed.
     * Plays the jump sound effect if the game is not muted.
     */
    jump() {
        this.speedY = 20;
        if (!this.world.gameIsMuted) {
            SoundManager.play('jump', 0.2, true);  // 0.5 → 0.2
        }
    }

    /**
     * Adds a coin to the character and plays the coin sound if the game is not muted.
     * Calls the parent class's addCoin method.
     *
     * @override
     */
    addCoin() {
        super.addCoin();
        const muted = this.world ? this.world.gameIsMuted : (typeof gameIsMuted !== 'undefined' ? gameIsMuted : false);
        if (!muted) SoundManager.playCoin();
    }

    /**
     * Adds a bottle to the character's inventory and plays the throw sound if the game is not muted.
     * Calls the parent class's addBottle method.
     *
     * @override
     */
    addBottle() {
        super.addBottle();
        const muted = this.world ? this.world.gameIsMuted : (typeof gameIsMuted !== 'undefined' ? gameIsMuted : false);
        if (!muted) SoundManager.playThrow();
    }
}

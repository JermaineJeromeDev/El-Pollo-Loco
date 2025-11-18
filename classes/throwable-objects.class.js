/**
 * Represents a thrown bottle
 * @class ThrowableObject
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    throwBottleAir = false;
    bottleSplash = false;
    isBreaking = false;
    offset = {
        left: 20,
        top: 20,
        right: 20,
        bottom: 20
    };
    intervalId;

    IMAGES_ROTATE = [
        'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_BOTTLE_SPLASH = [
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Creates a throwable object
     * @param {number} x - X-position
     * @param {number} y - Y-position
     * @param {boolean} direction - Throw direction (true = left)
     */
    constructor(x, y, direction) {
        super();
        this.otherDirection = direction;
        this.loadImage('assets/img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATE);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 70;
        this.width = 60;
        this.throw();
        this.animate();
    }
    
    /**
     * Throws the bottle
     */
    throw() {
        this.throwBottleAir = true;
        this.speedY = 20;
        if (this.otherDirection == true) {
            this.speedX = -10;  
        } else {
            this.speedX = 10;  
        }
        this.applyGravityAndMove();
    }

    /**
     * Applies gravity and moves bottle
     */
    applyGravityAndMove() {
        this.intervalId = setInterval(() => {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            this.x += this.speedX;
            if (this.y >= 380) {
                this.y = 380;
                this.breakAndSplash();
            }
        }, 1000 / 60);
    }

    /**
     * Makes bottle break and splash
     */
    breakAndSplash() {
        if (!this.isBreaking) {
            initBreaking(this);
        }
        this.playAnimation(this.IMAGES_BOTTLE_SPLASH, () => {
            this.fadeOut();
            playBreakSound(this.world);
        });
    }

    /**
     * Starts rotation animation
     */
    animate() {
        setInterval(() => {
            if (this.throwBottleAir) {
                this.playAnimation(this.IMAGES_ROTATE);
            }
        }, 2000 / 60);
    }
}

/**
 * Initializes breaking state
 * @param {ThrowableObject} bottle - Bottle instance
 */
function initBreaking(bottle) {
    bottle.throwBottleAir = false;
    bottle.isBreaking = true;
    bottle.speedX = 0;
    bottle.speedY = 0;
    clearInterval(bottle.intervalId);
}

/**
 * Plays break sound
 * @param {World} world - World instance
 */
function playBreakSound(world) {
    let muted = (world && world.gameIsMuted) || (typeof gameIsMuted !== 'undefined' && gameIsMuted);
    if (!muted) SoundManager.play('break', 0.4, true);
}
/**
 * Represents a normal chicken enemy
 * @class Chicken
 * @extends MovableObject
 */
class Chicken extends MovableObject {
    y = 360;
    speedY = 15;
    energy = 100;
    width = 75;
    height = 70;
    offset = {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    };

    IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGE_DEAD = [
        'assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ]

    /**
     * Creates an instance of the Chicken class.
     * Initializes the chicken's position, speed, and loads images for walking and dead states.
     * Starts the animation for the chicken.
     *
     * @constructor
     */
    constructor(){
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGE_DEAD);
        this.x = 500 + Math.random() * 1800; 
        this.y = 360;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    /**
     * Animates the chicken by updating its movement and checking its status.
     * Calls moveChicken() to handle movement logic and checkIfDead() to verify if the chicken is dead.
     */
    animate() {
        this.moveChicken();
        this.checkIfDead(); 
    }

    /**
     * Starts the movement and walking animation intervals for the chicken.
     * Movement is paused if the game is currently paused.
     * - Moves the chicken to the left at approximately 60 frames per second.
     * - Plays the walking animation every 200 milliseconds.
     */
    moveChicken() {
        this.moveInterval = setInterval(() => {
            if (this.world && this.world.gamePaused) return;
            this.moveLeft();
        }, 1000 / 60);
        this.animationInterval = setInterval(() => {
            if (this.world && this.world.gamePaused) return;
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    /**
     * Starts an interval that periodically checks if the chicken is dead.
     * If the chicken is dead, triggers the death handling logic.
     * The check runs every 100 milliseconds.
     */
    checkIfDead() {
        this.deathCheckInterval = setInterval(() => {
            if (this.isDead()) {
                this.handleDeath();
            }
        }, 100);
    }

    /**
     * Handles the death sequence for the chicken.
     * - Prevents multiple death handling by checking `isDeadHandled`.
     * - Loads the dead image.
     * - Performs cleanup operations.
     * - Initiates the falling animation after a short delay.
     */
    handleDeath() {
        if (this.isDeadHandled) return;
        this.isDeadHandled = true;
        this.loadImage(this.IMAGE_DEAD);
        this.cleanup();
        setTimeout(() => startFalling(this), 300);
    }
    
    /**
     * Cleans up all active intervals associated with this instance.
     * Stops movement, animation, and death check intervals if they are running.
     */
    cleanup() {
        if (this.moveInterval) clearInterval(this.moveInterval);
        if (this.animationInterval) clearInterval(this.animationInterval);
        if (this.deathCheckInterval) clearInterval(this.deathCheckInterval);
    }
}

/**
 * Starts falling animation
 * @param {Chicken} chicken - Chicken instance
 */
function startFalling(chicken) {
    const fallSpeed = 2;
    const groundLevel = 365;
    let fallInterval = setInterval(() => {
        chicken.y += fallSpeed;
        if (chicken.y >= groundLevel) {
            clearInterval(fallInterval);
        }
    }, 40);
}
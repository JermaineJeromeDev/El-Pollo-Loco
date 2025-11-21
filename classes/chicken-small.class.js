/**
 * Represents a small chicken enemy
 * @class ChickenSmall
 * @extends MovableObject
 */
class ChickenSmall extends MovableObject {
    y = 370;          
    width = 70;        
    height = 70;       
    
    IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    IMAGE_DEAD = [
        'assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    offset = {
        top: 8,       
        bottom: 8,   
        left: 8,      
        right: 8      
    };

    /**
     * Creates an instance of the small chicken enemy.
     * Initializes the chicken with a random position and speed,
     * loads walking and dead images, and starts animation.
     *
     * @constructor
     */
    constructor(){
        super().loadImage('assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGE_DEAD);
        this.x = 500 + Math.random() * 1800;
        this.y = 370;
        this.speed = 0.15 + Math.random() * 0.8;
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
     * The check is performed every 100 milliseconds.
     */
    checkIfDead() {
        this.deathCheckInterval = setInterval(() => {
            if (this.isDead()) {
                this.handleDeath();
            }
        }, 100);
    }

    /**
     * Handles the death sequence for the small chicken.
     * - Prevents multiple executions by checking `isDeadHandled`.
     * - Changes the chicken's image to the dead state.
     * - Performs cleanup operations.
     * - Initiates the falling animation after a short delay.
     */
    handleDeath() {
        if (this.isDeadHandled) return;
        this.isDeadHandled = true;
        this.loadImage(this.IMAGE_DEAD);
        this.cleanup();
        setTimeout(() => startSmallChickenFalling(this), 300);
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
 * Starts falling animation for small chicken
 * @param {ChickenSmall} chicken - Small chicken instance
 */
function startSmallChickenFalling(chicken) {
    const fallSpeed = 2;
    const groundLevel = 360; 
    let fallInterval = setInterval(() => {
        chicken.y += fallSpeed;
        if (chicken.y >= groundLevel) {
            clearInterval(fallInterval);
        }
    }, 40);
}
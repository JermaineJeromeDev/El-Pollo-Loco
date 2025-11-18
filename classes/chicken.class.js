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
     * Creates a new chicken instance
     */
    constructor(){
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGE_DEAD);
        this.x = 500 + Math.random() * 1800; 
        this.y = 365;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    /**
     * Initializes chicken movement and death check
     */
    animate() {
        this.moveChicken();
        this.checkIfDead(); 
    }

    /**
     * Starts chicken movement and animation intervals
     */
    moveChicken() {
        this.moveInterval = setInterval(() => {
            // NEU: Prüfe ob Spiel pausiert ist
            if (this.world && this.world.gamePaused) return;
            this.moveLeft();
        }, 1000 / 60);
        
        this.animationInterval = setInterval(() => {
            // NEU: Prüfe ob Spiel pausiert ist
            if (this.world && this.world.gamePaused) return;
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    /**
     * Checks periodically if chicken is dead
     */
    checkIfDead() {
        this.deathCheckInterval = setInterval(() => {
            if (this.isDead()) {
                this.handleDeath();
            }
        }, 100);
    }

    /**
     * Handles chicken death animation and falling
     */
    handleDeath() {
        if (this.isDeadHandled) return;
        this.isDeadHandled = true;
        this.loadImage(this.IMAGE_DEAD);
        this.cleanup();
        setTimeout(() => startFalling(this), 300);
    }
    
    /**
     * Clears all active intervals
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
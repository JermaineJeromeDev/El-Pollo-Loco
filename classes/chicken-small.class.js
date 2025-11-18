/**
 * Represents a small chicken enemy
 * @class ChickenSmall
 * @extends MovableObject
 */
class ChickenSmall extends MovableObject {
    y = 380;
    width = 50;
    height = 50;
    IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    IMAGE_DEAD = [
        'assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    offset = {
        top: 6,
        bottom: 6,
        left: 6,
        right: 6
    };


    /**
     * Creates a new small chicken instance
     */
    constructor(){
        super().loadImage('assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGE_DEAD);

        this.x = 500 + Math.random() * 1800;
        this.speed = 0.15 + Math.random() * 0.8;
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
        setTimeout(() => startSmallChickenFalling(this), 300);
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
 * Starts falling animation for small chicken
 * @param {ChickenSmall} chicken - Small chicken instance
 */
function startSmallChickenFalling(chicken) {
    const fallSpeed = 2;
    const groundLevel = 365;
    
    let fallInterval = setInterval(() => {
        chicken.y += fallSpeed;
        if (chicken.y >= groundLevel) {
            clearInterval(fallInterval);
        }
    }, 40);
}
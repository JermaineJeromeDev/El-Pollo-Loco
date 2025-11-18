/**
 * Represents a movable object in the game
 * @class MovableObject
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1.5;
    offset = { top: 0, left: 0, right: 0, bottom: 0 };
    rX; rY; rW; rH;
    energy = 100;
    lastHit = 0;
    coin = 0;
    bottle = 0;

    constructor() {
        super();
    }

    /**
     * Applies gravity to the object
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 30);
    }

    /**
     * Checks if object is above ground
     * @returns {boolean}
     */
    isAboveGround() {
        if(this instanceof ThrowableObject) return true;
        return this.y < 160;
    }

    /**
     * Calculates the real frame (with offset)
     */
    getRealFrame() {
        this.rX = this.x + this.offset.left;
        this.rY = this.y + this.offset.top;
        this.rW = this.width - this.offset.left - this.offset.right;
        this.rH = this.height - this.offset.top - this.offset.bottom;
    }

    /**
     * Checks collision with another object
     * @param {MovableObject} mo - Other object
     * @returns {boolean}
     */
    isColliding(mo) {
        this.getRealFrame();
        mo.getRealFrame();
        return (
            this.rX + this.rW > mo.rX &&
            this.rY + this.rH > mo.rY &&
            this.rX < mo.rX + mo.rW &&
            this.rY < mo.rY + mo.rH
        );
    }

    /**
     * Reduces energy on hit
     */
    hit() {
        if (this instanceof Character) this.energy -= 10;
        else if (this instanceof ChickenSmall) this.energy -= 2;
        else if (this instanceof Chicken) this.energy -= 5;
        else if (this instanceof Endboss) this.energy -= 20;
        
        if (this.energy < 0) this.energy = 0;
        this.lastHit = new Date().getTime();
    }

    /**
     * Checks if object is currently hurt
     * @returns {boolean}
     */
    isHurt() {
        const timepassed = (new Date().getTime() - this.lastHit) / 1000;
        return timepassed < 0.75;
    }

    /**
     * Checks if object is dead
     * @returns {boolean}
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Adds a coin
     */
    addCoin() {
        this.coin = Math.min(100, this.coin + 20);
    }

    /**
     * Adds a bottle
     */
    addBottle() {
        this.bottle = Math.min(100, this.bottle + 20);
    }

    /**
     * Plays animation
     * @param {Array<string>} images - Image paths
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        this.img = this.imageCache[images[i]];
        this.currentImage++;
    }

    /** Moves object to the right */
    moveRight() {
        this.x += this.speed;
    }

    /** Moves object to the left */
    moveLeft() {
        this.x -= this.speed;
    }

    /** Makes object jump */
    jump() {
        this.speedY = 20;
    }
}
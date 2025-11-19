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

    /**
     * Creates an instance of the class and calls the parent constructor.
     */
    constructor() {
        super();
    }

    /**
     * Applies gravity to the object by continuously updating its vertical position and speed.
     * The method uses a timer to simulate gravity, decreasing the vertical speed (`speedY`)
     * by the object's acceleration and updating its position (`y`) accordingly.
     * Gravity is applied only if the object is above the ground or moving upwards.
     *
     * @returns {void}
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
     * Calculates and updates the real frame coordinates and dimensions of the object,
     * taking into account the specified offsets.
     *
     * @returns {void}
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
     * Reduces the energy of the object based on its type when it is hit.
     * - Character: loses 10 energy
     * - ChickenSmall: loses 2 energy
     * - Chicken: loses 5 energy
     * - Endboss: loses 20 energy
     * Ensures energy does not drop below 0 and updates the last hit timestamp.
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
     * Increases the coin count by 20, up to a maximum of 100.
     */
    addCoin() {
        this.coin = Math.min(100, this.coin + 20);
    }

    /**
     * Increases the bottle count by 20, up to a maximum of 100.
     */
    addBottle() {
        this.bottle = Math.min(100, this.bottle + 20);
    }

    /**
     * Plays an animation sequence.
     * Each animation keeps its own frame counter.
     * @param {Array<string>} images - Array of image paths
     * @param {string} animationName - Unique name of the animation
     */
    playAnimation(images, animationName) {
        if (!this.animationFrames) this.animationFrames = {};
        if (!(animationName in this.animationFrames)) {
            this.animationFrames[animationName] = 0; 
        }
        let i = this.animationFrames[animationName] % images.length;
        this.img = this.imageCache[images[i]];
        this.animationFrames[animationName]++;
    }


    /**
     * Moves the object to the right by increasing its x-coordinate by its speed.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left by decreasing its x-coordinate by its speed.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Initiates a jump by setting the vertical speed.
     * @function
     * @returns {void}
     */
    jump() {
        this.speedY = 20;
    }
}
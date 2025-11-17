/**
 * Repräsentiert ein bewegliches Objekt im Spiel
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
     * Wendet Schwerkraft auf das Objekt an
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
     * Prüft ob Objekt über dem Boden ist
     * @returns {boolean}
     */
    isAboveGround() {
        if(this instanceof ThrowableObject) return true;
        return this.y < 160;
    }

    /**
     * Berechnet den echten Rahmen (mit Offset)
     */
    getRealFrame() {
        this.rX = this.x + this.offset.left;
        this.rY = this.y + this.offset.top;
        this.rW = this.width - this.offset.left - this.offset.right;
        this.rH = this.height - this.offset.top - this.offset.bottom;
    }

    /**
     * Prüft Kollision mit anderem Objekt
     * @param {MovableObject} mo - Anderes Objekt
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
     * Reduziert Energie bei Treffer
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
     * Prüft ob Objekt gerade verletzt ist
     * @returns {boolean}
     */
    isHurt() {
        const timepassed = (new Date().getTime() - this.lastHit) / 1000;
        return timepassed < 0.75;
    }

    /**
     * Prüft ob Objekt tot ist
     * @returns {boolean}
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Fügt Münze hinzu
     */
    addCoin() {
        this.coin = Math.min(100, this.coin + 20);
    }

    /**
     * Fügt Flasche hinzu
     */
    addBottle() {
        this.bottle = Math.min(100, this.bottle + 20);
    }

    /**
     * Spielt Animation ab
     * @param {Array<string>} images - Bild-Pfade
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        this.img = this.imageCache[images[i]];
        this.currentImage++;
    }

    /** Bewegt Objekt nach rechts */
    moveRight() {
        this.x += this.speed;
    }

    /** Bewegt Objekt nach links */
    moveLeft() {
        this.x -= this.speed;
    }

    /** Lässt Objekt springen */
    jump() {
        this.speedY = 20;
    }
}
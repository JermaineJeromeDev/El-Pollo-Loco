class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1.5;
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    rX;
    rY;
    rW;
    rH;
    energy = 100;
    lastHit = 0;
    coin = 0;
    bottle = 0;


    constructor() {
        super();
    }


    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
            this.speedY -= this.acceleration;
            }
        }, 1000 / 30);
    }


    isAboveGround() {
        if(this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 160;
        }
    }


    getRealFrame() {
        this.rX = this.x + this.offset.left;
        this.rY = this.y + this.offset.top;
        this.rW = this.width - this.offset.left - this.offset.right;
        this.rH = this.height - this.offset.top - this.offset.bottom;
    }


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


    hit() {
        this.energy -= 2;
        if(this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }


    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.75;
    }


    isDead() {
        return this.energy == 0;
    }

    addCoin() {
        this.coin += 20;
        if(this.coin > 100) {
            this.coin = 100;
        }
    }

    addBottle() {
        this.bottle += 20;
        if(this.bottle > 100) {
            this.bottle = 100;
        }
    }


    playAnimation(images) {
        let i = this.currentImage % images.length;
                let path = images[i];
                this.img = this.imageCache[path];
                this.currentImage ++;
    }


    moveRight() {
        this.x += this.speed;
    }


    moveLeft() {
        this.x -= this.speed;
    }


    jump() {
        this.speedY = 20;
    }
}
class MovableObject {
    x = 120;
    y = 280;
    img;
    height = 150;
    
    width = 100;
    imageCache = {};
    currentImage = 0;
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



    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
            this.speedY -= this.acceleration;
            }
        }, 1000 / 30);
    }


    isAboveGround() {
        return this.y < 160;
    }


    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }


    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }


    drawFrame(ctx) {

        if(this instanceof Character || this instanceof Chicken || this instanceof ChickenSmall || this instanceof Endboss){
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
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


    /**
     * 
     * @param {Array} arr - ['img/image1.png', 'img/image2.png', ...]
     */
    loadImages(arr){
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }


    playAnimation(images) {
        let i = this.currentImage % this.IMAGES_WALKING.length;
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
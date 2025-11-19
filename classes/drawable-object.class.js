/**
 * Base class for all drawable objects
 * @class DrawableObject
 */
class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    width = 100;
    height = 150;

    /**
     * Loads a single image
     * @param {string} path - Path to image
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws frame around object (debug)
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawFrame(ctx) {
        if(this instanceof Character || this instanceof Chicken || this instanceof ChickenSmall || this instanceof Endboss){
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'transparent';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    /**
     * Loads multiple images into cache
     * @param {Array<string>} arr - Array with image paths
     */
    loadImages(arr){
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}
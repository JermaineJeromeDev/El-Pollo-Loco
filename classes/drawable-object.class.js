/**
 * Basisklasse für alle zeichenbaren Objekte
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
     * Lädt ein einzelnes Bild
     * @param {string} path - Pfad zum Bild
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Zeichnet das Objekt auf Canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas Context
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Zeichnet Rahmen um Objekt (Debug)
     * @param {CanvasRenderingContext2D} ctx - Canvas Context
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
     * Lädt mehrere Bilder in Cache
     * @param {Array<string>} arr - Array mit Bild-Pfaden
     */
    loadImages(arr){
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}
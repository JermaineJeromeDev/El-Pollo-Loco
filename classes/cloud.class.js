/**
 * Represents a moving cloud
 * @class Cloud
 * @extends MovableObject
 */
class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;

    /**
     * Creates a new cloud
     * @param {number} x - X-position
     * @param {number} y - Y-position
     */
    constructor(x = Math.random() * 500, y = 20) {
        let images = [
            'assets/img/5_background/layers/4_clouds/1.png',
            'assets/img/5_background/layers/4_clouds/2.png'
        ];
        let randomIndex = Math.floor(Math.random() * images.length);
        super().loadImage(images[randomIndex]);
        this.x = x;
        this.y = y;
        this.animate();
    }

    /**
     * Starts the animation for the cloud by moving it to the left at a fixed interval (60 times per second).
     * Typically used to create a smooth movement effect.
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60); 
    }
}
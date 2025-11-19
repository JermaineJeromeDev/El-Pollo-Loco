/**
 * Represents a collectible bottle
 * @class Bottle
 * @extends MovableObject
 */
class Bottle extends MovableObject {
    height = 100;
    width = 100;
    IMAGES_BOTTLES = [
        'assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];
    offset = {
        top: 30,
        left: 30,
        right: 60,
        bottom: 60
    };

    /**
     * Creates a new bottle object.
     * Initializes the bottle by loading images, setting a random x position between 400-2200,
     * setting y position to 350, and starting the animation.
     * @constructor
     */
    constructor() {
        super()
        this.loadImage(this.IMAGES_BOTTLES[0]);
        this.loadImages(this.IMAGES_BOTTLES);
        this.x = 400 + Math.random() * 1800;
        this.y = 350;
        this.animate();
    }

    /**
     * Starts the animation loop for the object.
     * Repeatedly plays the bottle animation at a fixed interval.
     *
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLES);
        }, 300);
    }
}
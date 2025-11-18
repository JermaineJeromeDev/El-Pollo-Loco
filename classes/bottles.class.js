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
     * Creates a new bottle
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
     * Starts animation
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLES);
        }, 300);
    }
}
/**
 * Represents a collectible coin
 * @class Coin
 * @extends MovableObject
 */
class Coin extends MovableObject {
    height = 100;
    width = 100;
    COIN_IMAGES = [
        'assets/img/8_coin/coin_1.png',
        'assets/img/8_coin/coin_2.png'
    ];
    offset = {
        top: 30,
        left: 30,
        right: 60,
        bottom: 60
    };

    /**
     * Creates a new coin
     */
    constructor() {
        super()
        this.loadImage(this.COIN_IMAGES[0]);
        this.loadImages(this.COIN_IMAGES);
        this.x = 400 + Math.random() * 1800;
        this.y = 55 + Math.random() * 150;
        this.animate();
    }

    /**
     * Starts animation
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.COIN_IMAGES);
        }, 300);
    }
}
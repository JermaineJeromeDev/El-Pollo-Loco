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


    constructor() {
        super()
        this.loadImage(this.COIN_IMAGES[0]);
        this.loadImages(this.COIN_IMAGES);
        this.x = 200 + Math.random() * 1700;
        this.y = 200 + Math.random() * 50;
        this.animate();
        this.randomizePosition();
    }


    animate() {
        setInterval(() => {
        this.playAnimation(this.COIN_IMAGES);
        }, 300);
    }


    randomizePosition() {
    this.x = 500 + Math.random() * 1800;
    this.y = 125 + Math.random() * 250;
    }
}
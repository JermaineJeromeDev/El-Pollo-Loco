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
        this.x = 400 + Math.random() * 1800; // start ab x=400
        this.y = 55 + Math.random() * 150;
        this.animate();
    }


    animate() {
        setInterval(() => {
        this.playAnimation(this.COIN_IMAGES);
        }, 300);
    }
}
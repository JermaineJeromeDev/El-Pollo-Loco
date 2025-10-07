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
        this.loadImage('assets/img/8_coin/coin_1.png');
        this.loadImages(this.COIN_IMAGES);
        this.x = 200 + Math.random() * 1700;
        this.y = 200 + Math.random() * 50;
        this.animate();
    }


    animate() {
        setInterval(() => {
            let i = this.currentImage % this.COIN_IMAGES.length;
            let path = this.COIN_IMAGES[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 300);
    }
}
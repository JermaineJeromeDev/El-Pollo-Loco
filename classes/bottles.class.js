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


    constructor() {
        super()
        this.loadImage(this.IMAGES_BOTTLES[0]);
        this.loadImages(this.IMAGES_BOTTLES);
        this.x = 200 + Math.random() * 1900;
        this.y = 350;
        this.animate();
    }


    animate() {
        setInterval(() => {
        this.playAnimation(this.IMAGES_BOTTLES);
        }, 300);
    }
}
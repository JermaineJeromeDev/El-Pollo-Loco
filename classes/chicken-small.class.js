class ChickenSmall extends MovableObject {

    y = 380;
    width = 50;
    height = 50;
    IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];


    constructor(){
        super().loadImage('assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);

        this.x = 200 + Math.random() * 2000;
        this.speed = 0.15 + Math.random() * 0.8;

        this.animate();
    }

    animate(){
        setInterval(() => {
            if(this.x > 0){
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval( () => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}
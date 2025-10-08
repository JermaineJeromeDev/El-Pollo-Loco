class Chicken extends MovableObject {
    y = 360;
    speedY = 15;
    energy = 100;
    width = 75;
    height = 70;
    offset = {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    };

    IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGE_DEAD = [
        'assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ]

    constructor(){
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGE_DEAD);
        this.x = 200 + Math.random() * 2000;
        this.y = 365;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    animate() {
    this.moveChicken();
    this.checkIfDead(); 
    }

    moveChicken() {
        this.moveInterval = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    checkIfDead() {
        this.deathCheckInterval = setInterval(() => {
            if (this.isDead()) {
                this.handleDeath();
            }
        }, 100);
    }

    handleDeath() {
        if (this.isDeadHandled) return;
        this.isDeadHandled = true;
        this.loadImage(this.IMAGE_DEAD);
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
        clearInterval(this.deathCheckInterval);
        setTimeout(() => {
            let fallSpeed = 2; 
            let groundLevel = 365;

            let fallInterval = setInterval(() => {
                this.y += fallSpeed;
                if (this.y >= groundLevel) {
                    clearInterval(fallInterval);
                }
            }, 40);
        }, 300);
    }
}
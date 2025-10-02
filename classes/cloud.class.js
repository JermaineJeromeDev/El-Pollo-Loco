class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;

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

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60); // 60 FPS
    }
}
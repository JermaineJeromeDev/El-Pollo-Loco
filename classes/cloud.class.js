class Cloud extends MovableObject {

    constructor(){
        super()
        this.loadImage('assets/img/5_background/layers/4_clouds/1.png');

        this.x = Math.random() * 500; // Zahl zwischen 200 und 700
        this.y = 50;
        this.width = 500;
        this.height = 250;
    }
}
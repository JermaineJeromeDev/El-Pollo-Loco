class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;

    constructor(){
        super()
        this.loadImage('assets/img/5_background/layers/4_clouds/1.png');

        this.x = Math.random() * 500; // Zahl zwischen 200 und 700
    }
}
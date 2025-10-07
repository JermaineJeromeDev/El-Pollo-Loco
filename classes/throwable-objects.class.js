class ThrowableObject extends MovableObject {
    constructor(x, y) {
        super();
        this.loadImage('assets/img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 70;
        this.width = 60;
        this.throw();
    }


    throw() {
        this.speedY = 20;
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 25)
    }
}
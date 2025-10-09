class StatusBarEndboss extends DrawableObject {
    percentage = 100;
    IMAGES = [
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ];


    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 50;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }


    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }


    resolveImageIndex() {
        if(this.percentage > 80) {
            return 5;
        } else if(this.percentage > 60) {
            return 4;
        } else if(this.percentage > 40) {
            return 3;
        } else if(this.percentage > 20) {
            return 2;
        } else if(this.percentage > 0) {
            return 1;
        } else {
            return 0;
        }
    }
}
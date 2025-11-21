/**
 * Represents the bottle status bar
 * @class StatusBarBottles
 * @extends DrawableObject
 */
class StatusBarBottles extends DrawableObject {
    IMAGES_BOTTLE = [
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    percentageBottles = 0;

    /**
     * Creates an instance of the status bar for bottles.
     * Initializes the status bar by loading bottle images, setting its position and size,
     * and initializing the bottle percentage to 0.
     *
     * @constructor
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_BOTTLE);
        this.x = 20;
        this.y = this.getStatusBarY(50); 
        this.width = 200;
        this.height = 60;
        this.setPercentageBottles(0);
    }

    /**
     * Calculates Y-position based on screen size
     * @param {number} baseY - Base Y-position
     * @returns {number} Adjusted Y-position
     */
    getStatusBarY(baseY) {
        const isMobile = window.innerWidth <= 900;
        return isMobile ? baseY + 30 : baseY;
    }

    /**
     * Sets bottle percentage
     * @param {number} percentageBottles - Percentage value (0-100)
     */
    setPercentageBottles(percentageBottles) {
        this.percentageBottles = percentageBottles;
        let path = this.IMAGES_BOTTLE[this.resolveImageIndexBottles()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves image index for bottles
     * @returns {number} Image index
     */
    resolveImageIndexBottles() {
        if (this.percentageBottles == 100) return 5;
        else if (this.percentageBottles >= 80) return 4;
        else if (this.percentageBottles >= 60) return 3;
        else if (this.percentageBottles >= 40) return 2;
        else if (this.percentageBottles >= 20) return 1;
        else return 0;
    }
}
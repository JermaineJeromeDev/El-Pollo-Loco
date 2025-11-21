/**
 * Represents the health status bar
 * @class StatusBarHealth
 * @extends DrawableObject
 */
class StatusBarHealth extends DrawableObject {
    IMAGES_HEALTH = [
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    percentage = 100;

    /**
     * Creates an instance of the status bar.
     * Initializes the status bar by loading health images, setting its position,
     * dimensions, and default percentage value.
     *
     * @constructor
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_HEALTH);
        this.x = 20;
        this.y = this.getStatusBarY(0); 
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
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
     * Sets health percentage
     * @param {number} percentage - Percentage value (0-100)
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_HEALTH[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves image index based on percentage
     * @returns {number} Image index
     */
    resolveImageIndex() {
        if (this.percentage == 100) return 5;
        else if (this.percentage >= 80) return 4;
        else if (this.percentage >= 60) return 3;
        else if (this.percentage >= 40) return 2;
        else if (this.percentage >= 20) return 1;
        else return 0;
    }
}
/**
 * Represents the coin status bar
 * @class StatusBarCoins
 * @extends DrawableObject
 */
class StatusBarCoins extends DrawableObject {
    IMAGES_COIN = [
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    percentageCoins = 0;

    /**
     * Creates an instance of the status bar.
     * Initializes the status bar by loading health images, setting its position,
     * dimensions, and default percentage value.
     *
     * @constructor
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_COIN);
        this.x = 20;
        this.y = this.getStatusBarY(100);
        this.width = 200;
        this.height = 60;
        this.setPercentageCoins(0);
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
     * Sets coin percentage
     * @param {number} percentageCoins - Percentage value (0-100)
     */
    setPercentageCoins(percentageCoins) {
        this.percentageCoins = percentageCoins;
        let path = this.IMAGES_COIN[this.resolveImageIndexCoins()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves image index for coins
     * @returns {number} Image index
     */
    resolveImageIndexCoins() {
        if (this.percentageCoins == 100) return 5;
        else if (this.percentageCoins >= 80) return 4;
        else if (this.percentageCoins >= 60) return 3;
        else if (this.percentageCoins >= 40) return 2;
        else if (this.percentageCoins >= 20) return 1;
        else return 0;
    }
}
/**
 * Repräsentiert die Gesundheits-Statusbar
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
     * Erstellt eine neue Gesundheits-Statusbar
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_HEALTH);
        this.x = 20;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Setzt Prozentsatz der Gesundheit
     * @param {number} percentage - Prozentwert (0-100)
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_HEALTH[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Ermittelt Bild-Index basierend auf Prozentsatz
     * @returns {number} Index des Bildes
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

/**
 * Repräsentiert die Flaschen-Statusbar
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
     * Erstellt eine neue Flaschen-Statusbar
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_BOTTLE);
        this.x = 20;
        this.y = 50;
        this.width = 200;
        this.height = 60;
        this.setPercentageBottles(0);
    }

    /**
     * Setzt Prozentsatz der Flaschen
     * @param {number} percentageBottles - Prozentwert (0-100)
     */
    setPercentageBottles(percentageBottles) {
        this.percentageBottles = percentageBottles;
        let path = this.IMAGES_BOTTLE[this.resolveImageIndexBottles()];
        this.img = this.imageCache[path];
    }

    /**
     * Ermittelt Bild-Index für Flaschen
     * @returns {number} Index des Bildes
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

/**
 * Repräsentiert die Münzen-Statusbar
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
     * Erstellt eine neue Münzen-Statusbar
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_COIN);
        this.x = 20;
        this.y = 100;
        this.width = 200;
        this.height = 60;
        this.setPercentageCoins(0);
    }

    /**
     * Setzt Prozentsatz der Münzen
     * @param {number} percentageCoins - Prozentwert (0-100)
     */
    setPercentageCoins(percentageCoins) {
        this.percentageCoins = percentageCoins;
        let path = this.IMAGES_COIN[this.resolveImageIndexCoins()];
        this.img = this.imageCache[path];
    }

    /**
     * Ermittelt Bild-Index für Münzen
     * @returns {number} Index des Bildes
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
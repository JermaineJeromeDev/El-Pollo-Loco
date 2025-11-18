/**
 * Represents a game level
 * @class Level
 */
class Level {
    clouds;
    enemies;
    coins;
    bottles;
    backgroundObjects;
    level_end_x = 2260;

    /**
     * Creates a new level
     * @param {Array} clouds - Cloud objects
     * @param {Array} enemies - Enemy objects
     * @param {Array} coins - Coin objects
     * @param {Array} bottle - Bottle objects
     * @param {Array} backgroundObjects - Background objects
     */
    constructor(clouds, enemies, coins, bottle, backgroundObjects) {
        this.clouds = clouds;
        this.enemies = enemies;
        this.coins = coins;
        this.bottles = bottle;
        this.backgroundObjects = backgroundObjects;
    }
}
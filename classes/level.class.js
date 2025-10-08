class Level {
    clouds;
    enemies;
    coins;
    bottles;
    backgroundObjects;
    level_end_x = 2260;

    constructor(clouds, enemies, coins, bottle, backgroundObjects) {
        this.clouds = clouds;
        this.enemies = enemies;
        this.coins = coins;
        this.bottles = bottle;
        this.backgroundObjects = backgroundObjects;
    }
}
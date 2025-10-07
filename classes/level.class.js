class Level {
    clouds;
    enemies;
    backgroundObjects;
    coins;
    level_end_x = 2260;

    constructor(clouds, enemies, coins, backgroundObjects) {
        this.clouds = clouds;
        this.enemies = enemies;
        this.coins = coins;
        this.backgroundObjects = backgroundObjects;
    }
}
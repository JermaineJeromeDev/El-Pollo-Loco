class Level {
    clouds;
    enemies;
    backgroundObjects;
    level_end_x = 2260;

    constructor(clouds, enemies, backgroundObjects) {
        this.clouds = clouds;
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
    }
}
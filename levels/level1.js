/**
 * Creates and returns level 1
 * @returns {Level} Level 1 instance
 */
function createLevel1() {
    return new Level(
        [
            new Cloud(100, 20),
            new Cloud(600, 40),
            new Cloud(1200, 60),
            new Cloud(1700, 20),
            new Cloud(2200, 40),
            new Cloud(2700, 60),
        ],

        [
            new Chicken(),
            new ChickenSmall(),
            new Chicken(),
            new ChickenSmall(),
            new Chicken(),
            new ChickenSmall(),
            new Chicken(),
            new ChickenSmall(),
            new Chicken(),
            new ChickenSmall(),
            new Chicken(),
            new ChickenSmall(),
            new Chicken(),
            new ChickenSmall(),
            new Chicken(),
            new ChickenSmall(),
            new Chicken(),
            new Endboss()
        ],

        [
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin()
        ],

        [
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle()
        ],
        
        [
            new BackgroundObject('assets/img/5_background/layers/air.png', -720),
            new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', -720),
            new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', -720),
            new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', -720),

            new BackgroundObject('assets/img/5_background/layers/air.png', 0),
            new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 0),
            new BackgroundObject('assets/img/5_background/layers/air.png', 720),
            new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 720),
            new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 720),
            new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 720),

            new BackgroundObject('assets/img/5_background/layers/air.png', 720 * 2),
            new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 720 * 2),
            new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 720 * 2),
            new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 720 * 2),

            new BackgroundObject('assets/img/5_background/layers/air.png', 720 * 3),
            new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 720 * 3),
            new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 720 * 3),
            new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 720 * 3)
        ]
    );
}

// For backward compatibility
let level1 = createLevel1();
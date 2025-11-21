/**
 * Represents the game world
 * @class World
 */
class World {
    character = new Character();
    level; 
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBarHealth = new StatusBarHealth();
    statusBarCoins = new StatusBarCoins();
    statusBarBottles = new StatusBarBottles();
    statusBarEndBoss = new StatusBarEndboss();
    throwableObjects = [];
    canThrow = true; 
    endbossActivated = false;
    gameStopped = false;
    gamePaused = false; 
    intervals = [];

    /**
     * Creates a new world instance
     * @param {HTMLCanvasElement} canvas - The game canvas
     * @param {Keyboard} keyboard - The keyboard instance
     */
    constructor(canvas, keyboard){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = createLevel1(); 
        this.draw();
        this.setWorld();
        this.run();
        this.checkCollisions();
    }

    /**
     * Sets the current world instance for the character and all enemies in the level.
     * For enemies that are instances of Endboss, also calls their setWorld method.
     *
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            enemy.world = this; 
        });
    }

    /**
     * Renders the game world onto the canvas.
     * Handles camera translation, draws background objects, game objects, status bars,
     * and schedules the next frame using requestAnimationFrame.
     * Stops rendering if the game is stopped.
     */
    draw() {
        if (this.gameStopped) return; 
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.drawGameObjects();
        this.drawEndbossStatusBar();
        this.ctx.translate(-this.camera_x, 0);
        this.drawStatusBars();
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws the status bars for health, bottles, and coins on the map.
     * Adds each status bar to the map for rendering.
     */
    drawStatusBars() {
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarBottles);
        this.addToMap(this.statusBarCoins);
    }

    /**
     * Draws the status bar for the Endboss enemy on the canvas.
     * The status bar is displayed when the Endboss is activated,
     * which occurs when the character approaches within 300 pixels of the Endboss.
     * The status bar's position is dynamically updated based on the Endboss's coordinates.
     *
     * @returns {void}
     */
    drawEndbossStatusBar() {
        let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss && endboss.statusBarEndboss) {
            if (!this.endbossActivated && endboss.world && endboss.world.character.x > endboss.x - 300) {
                this.endbossActivated = true;
            }
            if (this.endbossActivated) {
                endboss.statusBarEndboss.x = endboss.x + 80;
                endboss.statusBarEndboss.y = endboss.y + 30;
                endboss.statusBarEndboss.draw(this.ctx);
            }
        }
    }

    /**
     * Draws all game objects onto the map, including the main character,
     * clouds, enemies, coins, bottles, and throwable objects.
     * Utilizes helper methods to add each type of object to the map.
     */
    drawGameObjects() {
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
    }

    /**
     * Adds objects array to map
     * @param {Array} objects - Objects to add
     */
    addObjectsToMap(objects){
        objects.forEach(o => this.addToMap(o));
    }

    /**
     * Adds single object to map
     * @param {MovableObject} mo - Object to add
     */
    addToMap(mo){
        if(mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        if(mo.otherDirection) this.flipImageBack(mo);
    }

    /**
     * Flips image horizontally
     * @param {MovableObject} mo - Object to flip
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Flips image back
     * @param {MovableObject} mo - Object to flip back
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Starts the main game loop, executing collision and object checks at regular intervals.
     * The loop is paused if `gamePaused` is true, skipping all checks until resumed.
     * The interval ID is stored in the `intervals` array for later management.
     *
     * @returns {void}
     */
    run() {
        let id = setInterval(() => {
            if (this.gamePaused) {
                return;
            }
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkCoinCollision();
            this.checkBottleCollision();
        }, 50);
        this.intervals.push(id);
    }

    /**
     * Clears all active intervals associated with the world and its enemies.
     * This method stops all intervals stored in the `intervals` array and resets it.
     * Additionally, it clears movement, animation, death check, and dead animation intervals for each enemy in the current level.
     */
    clearAllIntervals() {
        this.intervals.forEach(i => clearInterval(i));
        this.intervals = [];
        if (this.level && this.level.enemies) {
            this.level.enemies.forEach(enemy => {
                if (enemy.moveInterval) clearInterval(enemy.moveInterval);
                if (enemy.animationInterval) clearInterval(enemy.animationInterval);
                if (enemy.deathCheckInterval) clearInterval(enemy.deathCheckInterval);
                if (enemy.deadAnimationInterval) clearInterval(enemy.deadAnimationInterval);
            });
        }
    }

    /**
     * Checks if the conditions to throw an object are met (keyboard 'D' pressed, character has bottles, and throwing is allowed),
     * and triggers the throw action if so.
     */
    checkThrowObjects() {
        if(this.keyboard.D && this.character.bottle > 0 && this.canThrow) {
            this.throwBottle();
        }
    }

    /**
     * Throws a bottle in the direction the character is facing.
     * Creates a new ThrowableObject, adds it to the world, plays a sound if not muted,
     * decreases the character's bottle count, updates the status bar, and prevents
     * further throws for 1 second.
     *
     * @throws {ThrowableObject} Adds a new throwable object to the world.
     */
    throwBottle() {
        let direction = this.character.otherDirection;
        let offsetX = direction ? -100 : 100;
        let bottle = new ThrowableObject(this.character.x + offsetX, this.character.y + 100, direction);
        bottle.world = this;
        this.throwableObjects.push(bottle);
        if (!this.gameIsMuted) SoundManager.play('throw', 0.3, true); 
        this.character.bottle -= 20;
        if(this.character.bottle < 0) this.character.bottle = 0;
        this.statusBarBottles.setPercentageBottles(this.character.bottle);
        this.canThrow = false;
        setTimeout(() => {
            this.canThrow = true;
        }, 1000);
    }

    /**
     * Checks for collisions between the player and enemies in the current level.
     * Handles collisions with chickens and the endboss separately.
     * Also checks if any enemy is hit with a bottle.
     *
     * @returns {void}
     */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.isChicken(enemy)) {
                this.handleChickenCollision(enemy);
            } else if (enemy instanceof Endboss) {
                this.handleEndbossCollision(enemy);
            }
        });
        this.hitEnemyWithBottle();
    }

    /**
     * Checks if enemy is a chicken
     * @param {Object} enemy - Enemy to check
     * @returns {boolean}
     */
    isChicken(enemy) {
        return (enemy instanceof Chicken || enemy instanceof ChickenSmall) && !enemy.isDead();
    }

    /**
     * Handles chicken collision
     * @param {Object} enemy - Chicken enemy
     */
    handleChickenCollision(enemy) {
        if (!this.character.isColliding(enemy)) return;
        if (this.isTrample(enemy)) {
            this.trampleChicken(enemy);
        } else if (!this.character.isHurt()) {
            this.hurtByChicken();
        }
    }

    /**
     * Checks if the character tramples the chicken from above
     * @param {Object} enemy - Chicken enemy
     * @returns {boolean}
     */
    isTrample(enemy) {
        const characterBottom = this.character.y + this.character.height - this.character.offset.bottom;
        const enemyTop = enemy.y + enemy.offset.top;
        const isJumpingDown = this.character.speedY < 0;
        return isJumpingDown && characterBottom <= enemyTop + enemy.height * 0.5 && !this.character._alreadyTrampled;
    }

    /**
     * Handles trample action on chicken
     * @param {Object} enemy - Chicken enemy
     */
    trampleChicken(enemy) {
        enemy.energy = 0;
        enemy.die && enemy.die();
        this.character.speedY = 15;
        this.character.y -= 15;
        this.character._alreadyTrampled = true;
        setTimeout(() => { this.character._alreadyTrampled = false; }, 150);
    }

    /**
     * Handles character getting hurt by chicken
     */
    hurtByChicken() {
        this.character.hit();
        this.statusBarHealth.setPercentage(this.character.energy);
    }

    /**
     * Handles endboss collision
     * @param {Endboss} enemy - Endboss enemy
     */
    handleEndbossCollision(enemy) {
        if (this.character.isColliding(enemy) && !enemy.isDead() && !this.character.isHurt()) {
            this.character.hit();
            this.statusBarHealth.setPercentage(this.character.energy);
        }
    }

    /**
     * Handles chicken hit by bottle
     * @param {Chicken|ChickenSmall} enemy - Chicken enemy
     * @param {number} enemyIndex - Index in enemies array
     */
    handleChickenHitByBottle(enemy, enemyIndex) {
        enemy.energy = 0;
        enemy.die && enemy.die();
        setTimeout(() => {
            this.level.enemies.splice(enemyIndex, 1);
        }, 1000);
    }

    /**
     * Handles endboss hit by bottle
     * @param {Endboss} enemy - Endboss enemy
     */
    handleEndbossHitByBottle(enemy) {
        enemy.hit();
    }

    /**
     * Processes bottle collision with enemy
     * @param {MovableObject} enemy - Enemy object
     * @param {number} enemyIndex - Enemy index
     * @param {number} bottleIndex - Bottle index
     */
    processBottleHit(enemy, enemyIndex, bottleIndex) {
        if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
            this.handleChickenHitByBottle(enemy, enemyIndex);
        } else if (enemy instanceof Endboss) {
            this.handleEndbossHitByBottle(enemy);
        }
        this.throwableObjects.splice(bottleIndex, 1);
    }

    /**
     * Checks for collisions between throwable bottles and enemies.
     * If a bottle collides with a living enemy, processes the hit.
     *
     * Iterates through all enemies and throwable objects, and for each collision
     * where the enemy is not dead, calls `processBottleHit` with the enemy and bottle indices.
     */
    hitEnemyWithBottle() {
        this.level.enemies.forEach((enemy, enemyIndex) => {
            this.throwableObjects.forEach((bottle, bottleIndex) => {
                if (bottle.isColliding(enemy) && !enemy.isDead()) {
                    this.processBottleHit(enemy, enemyIndex, bottleIndex);
                }
            });
        });
    }

    /**
     * Checks for collisions between the character and coins in the level.
     * Coins are only collected if the status bar is not full.
     */
    checkCoinCollision() {
        for (let index = this.level.coins.length - 1; index >= 0; index--) {
            let coin = this.level.coins[index];
            if (this.character.isColliding(coin)) {
                    this.character.addCoin();
                    this.statusBarCoins.setPercentageCoins(this.character.coin);
                    this.level.coins.splice(index, 1);
            }
        }
    }

    /**
     * Checks for collisions between the character and bottles in the level.
     * Bottles are only collected if the status bar is not full.
     */
    checkBottleCollision() {
        for (let index = this.level.bottles.length - 1; index >= 0; index--) {
            let bottle = this.level.bottles[index];
            if (this.character.isColliding(bottle)) {
                if (this.character.bottle < 100) {
                    this.character.addBottle();
                    this.statusBarBottles.setPercentageBottles(this.character.bottle);
                    this.level.bottles.splice(index, 1);
                }
            }
        }
    }

    /**
     * Stops the game by setting the `gameStopped` flag to true.
     */
    stopGame() {
        this.gameStopped = true;
    }
}
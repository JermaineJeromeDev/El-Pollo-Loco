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
     * Sets world reference for character and enemies
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            enemy.world = this; 
            if (enemy instanceof Endboss) {
                enemy.setWorld(this);
            }
        });
    }

    /**
     * Main draw loop
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
     * Draws status bars
     */
    drawStatusBars() {
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarBottles);
        this.addToMap(this.statusBarCoins);
    }

    /**
     * Draws endboss status bar
     */
    drawEndbossStatusBar() {
        let endboss = this.level.enemies.find(e => e instanceof Endboss);
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
     * Draws all game objects
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
     * Main game loop
     */
    run() {
        let id = setInterval(() => {
            if (this.gamePaused) {
                console.log('⏸️ Game loop skipped - paused'); // DEBUG
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
     * Clears all intervals
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
     * Checks if throw key is pressed
     */
    checkThrowObjects() {
        if(this.keyboard.D && this.character.bottle > 0 && this.canThrow) {
            this.throwBottle();
        }
    }

    /**
     * Throws a bottle
     */
    throwBottle() {
        let direction = this.character.otherDirection;
        let offsetX = direction ? -100 : 100;
        let bottle = new ThrowableObject(this.character.x + offsetX, this.character.y + 100, direction);
        bottle.world = this;
        this.throwableObjects.push(bottle);
        if (!this.gameIsMuted) SoundManager.play('throw', 0.3, true);  // 0.6 → 0.3
        this.character.bottle -= 20;
        if(this.character.bottle < 0) this.character.bottle = 0;
        this.statusBarBottles.setPercentageBottles(this.character.bottle);
        this.canThrow = false;
        setTimeout(() => {
            this.canThrow = true;
        }, 1000);
    }

    /**
     * Checks all collisions
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
        const characterBottom = this.character.y + this.character.height - this.character.offset.bottom;
        const enemyTop = enemy.y + enemy.offset.top;
        const hitsFromAbove = this.character.speedY < 0 && characterBottom <= enemyTop + enemy.height * 0.3;
        if (hitsFromAbove) {
            enemy.energy = 0;
            enemy.die && enemy.die();
            this.character.speedY = 20;
        } else if (!this.character.isHurt()) {
            this.character.hit();
            this.statusBarHealth.setPercentage(this.character.energy);
        }
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
     * Checks if bottle hits enemy
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
     * Checks coin collision
     */
    checkCoinCollision() {
        this.level.coins.forEach((coin, index) => {
            if(this.character.isColliding(coin)) {
                this.character.addCoin();
                this.statusBarCoins.setPercentageCoins(this.character.coin);
                this.level.coins.splice(index, 1)
            }
        });
    }

    /**
     * Checks bottle collision
     */
    checkBottleCollision() {
        this.level.bottles.forEach((bottle, index) => {
            if(this.character.isColliding(bottle)) {
                this.character.addBottle();
                this.statusBarBottles.setPercentageBottles(this.character.bottle);
                this.level.bottles.splice(index, 1)
            }
        });
    }

    /**
     * Stops the game
     */
    stopGame() {
        this.gameStopped = true;
    }
}

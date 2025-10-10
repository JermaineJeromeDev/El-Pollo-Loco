class World {
    character = new Character();
    level = level1;
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

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
        this.checkCollisions();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                enemy.setWorld(this);
            }
        });
    }

    // ----------------- Draw() -----------------
    draw() {
        if (this.gameStopped) return; // Stoppe das Zeichnen nach Win-Screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.drawStatusBars();
        this.drawEndbossStatusBar();
        this.ctx.translate(this.camera_x, 0);
        this.drawGameObjects();
        this.ctx.translate(-this.camera_x, 0);
        requestAnimationFrame(() => this.draw());
    }

    drawStatusBars() {
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarBottles);
        this.addToMap(this.statusBarCoins);
    }

    drawEndbossStatusBar() {
        let endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.statusBarEndboss) {
            if (!this.endbossActivated && endboss.world && endboss.world.character.x > endboss.x - 300) {
                this.endbossActivated = true;
            }
            if (this.endbossActivated) {
                endboss.statusBarEndboss.x = this.canvas.width - endboss.statusBarEndboss.width - 20;
                endboss.statusBarEndboss.y = 20;
                endboss.statusBarEndboss.draw(this.ctx);
            }
        }
    }

    drawGameObjects() {
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
    }

    addObjectsToMap(objects){
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(mo){
        if(mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        if(mo.otherDirection) this.flipImageBack(mo);
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkCoinCollision();
            this.checkBottleCollision();
        }, 50);
    }

    // ----------------- Flaschen werfen -----------------
    checkThrowObjects() {
        if(this.keyboard.D && this.character.bottle > 0 && this.canThrow) {
            this.throwBottle();
        }
    }

    throwBottle() {
        let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
        this.throwableObjects.push(bottle);
        this.character.bottle -= 20;
        if(this.character.bottle < 0) this.character.bottle = 0;
        this.statusBarBottles.setPercentageBottles(this.character.bottle);
        this.canThrow = false;
        setTimeout(() => {
            this.canThrow = true;
        }, 1000);
    }

    // ----------------- Kollisionen -----------------
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

    isChicken(enemy) {
        return (enemy instanceof Chicken || enemy instanceof ChickenSmall) && !enemy.isDead();
    }

    handleChickenCollision(enemy) {
        if (this.character.isColliding(enemy)) {
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
    }

    handleEndbossCollision(enemy) {
        if (this.character.isColliding(enemy) && !enemy.isDead() && !this.character.isHurt()) {
            this.character.hit();
            this.statusBarHealth.setPercentage(this.character.energy);
        }
    }


    hitEnemyWithBottle() {
        this.level.enemies.forEach((enemy, enemyIndex) => {
            this.throwableObjects.forEach((bottle, bottleIndex) => {
                if (bottle.isColliding(enemy) && !enemy.isDead()) {
                    if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
                        enemy.energy = 0;
                        enemy.die && enemy.die();
                        setTimeout(() => {
                            this.level.enemies.splice(enemyIndex, 1);
                        }, 1000);
                    } else if (enemy instanceof Endboss) {
                        enemy.hit();
                    }
                    this.throwableObjects.splice(bottleIndex, 1);
                }
            });
        });
    }

    checkCoinCollision() {
        this.level.coins.forEach((coin, index) => {
            if(this.character.isColliding(coin)) {
                this.character.addCoin();
                this.statusBarCoins.setPercentageCoins(this.character.coin);
                this.level.coins.splice(index, 1)
            }
        });
    }

    checkBottleCollision() {
        this.level.bottles.forEach((bottle, index) => {
            if(this.character.isColliding(bottle)) {
                this.character.addBottle();
                this.statusBarBottles.setPercentageBottles(this.character.bottle);
                this.level.bottles.splice(index, 1)
            }
        });
    }

    stopGame() {
        this.gameStopped = true;
    }

    stopSounds(state) {
        this.GAME_MUSIC.muted = state;
        this.CHICKEN_SOUND.muted = state;
        this.ENEMY_HIT_SOUND.muted = state;
        this.SOUND_BOTTLE.muted = state;
        if (this.character) {
            this.character.walking_sound && (this.character.walking_sound.muted = state);
            this.character.jumping_sound && (this.character.jumping_sound.muted = state);
            this.character.hurt_sound && (this.character.hurt_sound.muted = state);
        }
    }

    stopWinAndLostSound(state) {
        this.GAME_LOST_SOUND.muted = state;
        this.GAME_WIN_SOUND.muted = state;
    }

    stopSoundsAndIntervals() {
        this.stopSounds(true);
        if (this.character && this.character.intervalIds) {
            this.character.intervalIds.forEach(clearInterval);
        }
        if (this.character && typeof this.character.stopGame === 'function') {
            this.character.stopGame();
        }
    }
}

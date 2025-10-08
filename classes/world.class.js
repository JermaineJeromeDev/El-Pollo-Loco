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
    throwableObjects = [];
    canThrow = true; 

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
            if ((enemy instanceof Chicken || enemy instanceof ChickenSmall) && !enemy.isDead()) {
                if (this.character.isColliding(enemy)) {
                    const characterBottom = this.character.y + this.character.height;
                    const enemyTop = enemy.y;
                    // Von oben: Gegner stirbt, kein Schaden für Character
                    if (this.character.speedY > 0 && characterBottom <= enemyTop + enemy.height) {
                        enemy.energy = 0;
                        this.character.jump();
                    } else if (!this.character.isHurt()) {
                        // Von der Seite: Character bekommt nur Schaden, wenn nicht gerade unverwundbar
                        this.character.hit();
                        this.statusBarHealth.setPercentage(this.character.energy);
                    }
                }
            } else if (enemy instanceof Endboss) {
                if (this.character.isColliding(enemy) && !enemy.isDead() && !this.character.isHurt()) {
                    this.character.hit();
                    this.statusBarHealth.setPercentage(this.character.energy);
                }
            }
        });

        // Flaschen-Kollisionen
        this.hitEnemyWithBottle();
    }

    hitEnemyWithBottle() {
        this.level.enemies.forEach((enemy, enemyIndex) => {
            this.throwableObjects.forEach((bottle, bottleIndex) => {
                if (bottle.isColliding(enemy) && !enemy.isDead()) {
                    if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
                        enemy.energy = 0; 
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

    hitEnemy() {
        this.level.enemies.forEach((enemy, index) => {
            this.throwableObjects.forEach((bottle, bottleIndex) => {
                if(bottle.isColliding(enemy)) {
                    enemy.isDead();
                    this.throwableObjects.splice(bottleIndex, 1);
                }
                if(enemy.isDead()) {
                    setTimeout(() => {
                        this.level.enemies.splice(index, 1);
                    }, 1000);
                }
            });
        });
    }

    // ----------------- Draw() -----------------
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0);
        this.addObjectsToMap([this.statusBarHealth, this.statusBarBottles, this.statusBarCoins]);
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);

        requestAnimationFrame(() => this.draw());
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
}
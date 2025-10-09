class Endboss extends MovableObject {
    offset = {
        top: 90,
        bottom: 40,
        left: 24,
        right: 20
    }

    IMAGES_ALERT = [
        'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_WALKING = [
        'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ATTACK = [
        'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    alertSound = new Audio('./audio/chicken/chicken_single_alarm.mp3');
    hurtSound = new Audio('./audio/chicken/chicken_single_alarm.mp3');
    audioArrayEndboss = [];

    alertPlayed = false;
    alertAnimationDone = false;
    alertAnimationIndex = 0;
    activated = false;

    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.audioArrayEndboss.push(this.alertSound, this.hurtSound);
        this.height = 450;
        this.width = 300;
        this.y = 0;
        this.x = 2550;
        this.speed = 0.8;
        this.animate();
    }

    setWorld(world) {
        this.world = world;
    }

    animate() {
        setInterval(() => {
            if (this.isDead()) {
                this.speed = 0;
                this.playAnimation(this.IMAGES_DEAD);
                if (this.world) this.world.win = true;
            } else if (this.isHurtEndboss()) {
                this.speed = 0;
                this.playAnimation(this.IMAGES_HURT);
                this.playHurtSound();
            } else if (!this.alertAnimationDone && this.isPlayerNear()) {
                this.speed = 0;
                this.playAlertAnimation();
                this.activated = true;
                if (!this.statusBarEndboss) {
                    this.statusBarEndboss = new StatusBarEndboss();
                }
            } else if (this.alertAnimationDone || this.activated) { 
                this.alertAnimationDone = true; 
                this.activated = true; 
                this.handleMovementAndAnimation();
            }
            if (this.statusBarEndboss) {
                this.statusBarEndboss.setPercentage(this.energy);
            }
        }, 120); 
        setInterval(() => {
            if (!this.isDead() && !this.isHurtEndboss() && (this.alertAnimationDone || this.activated)) {
                this.handleMovement();
            }
        }, 1000 / 60);
    }

    isPlayerNear() {
        return this.world && this.world.character.x > this.x - 300 && this.world.character.x < this.x + 1000;
    }

    playAlertAnimation() {
        if (!this.alertPlayed) {
            this.alertSound.currentTime = 0;
            this.alertSound.muted = false;
            this.alertSound.volume = 0.2;
            this.alertSound.playbackRate = 1.2;
            this.alertSound.play();
            this.alertPlayed = true;
        }
        this.playAnimation(this.IMAGES_ALERT);
        this.alertAnimationIndex++;
        if (this.alertAnimationIndex >= this.IMAGES_ALERT.length * 2) {
            this.alertAnimationDone = true;
            this.alertSound.pause();
            this.alertSound.currentTime = 0;
        }
    }

    handleMovementAndAnimation() {
        if (this.world.character.x > this.x - 500) {
            this.speed = 2;
            this.playAnimation(this.IMAGES_ATTACK);
        } else if (this.world.character.x > this.x - 300) {
            this.speed = 0.8;
            this.playAnimation(this.IMAGES_ALERT);
        } else {
            this.speed = 0.4;
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    handleMovement() {
        this.moveLeft();
    }

    playHurtSound() {
        if (this.hurtSound.paused) {
            this.hurtSound.currentTime = 0;
            this.hurtSound.muted = false;
            this.hurtSound.volume = 0.2;
            this.hurtSound.playbackRate = 1.2;
            this.hurtSound.play();
        }
    }

    isHurtEndboss() {
        return this.isHurt();
    }

    hit() {
        this.energy -= 20;
        if (this.energy < 0) this.energy = 0;
        this.lastHit = new Date().getTime();
        if (this.statusBarEndboss) {
            this.statusBarEndboss.setPercentage(this.energy);
        }
    }
}

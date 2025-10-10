let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let gameIsMuted = false;
let gameState = 'start'; // 'start', 'playing', 'win', 'lose'
let menuButtons = [];
let isFullscreen = false;
let hoveredButtonIndex = -1;

window.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    drawStartScreen();

    // Canvas-Eventlistener erst hinzufügen, wenn das Canvas existiert!
    if (canvas && typeof canvas.addEventListener === 'function') {
        // Verhindere mehrfaches Hinzufügen von EventListenern
        if (!canvas._listenersAdded) {
            canvas.addEventListener('click', function(event) {
                let rect = canvas.getBoundingClientRect();
                let mx = event.clientX - rect.left;
                let my = event.clientY - rect.top;
                menuButtons.forEach(btn => {
                    if (mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h) {
                        btn.onClick();
                    }
                });
            });

            canvas.addEventListener('mousemove', function(event) {
                if (gameState === 'start' || gameState === 'options' || gameState === 'win' || gameState === 'lose') {
                    let rect = canvas.getBoundingClientRect();
                    let mx = event.clientX - rect.left;
                    let my = event.clientY - rect.top;
                    hoveredButtonIndex = -1;
                    menuButtons.forEach((btn, idx) => {
                        if (mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h) {
                            hoveredButtonIndex = idx;
                        }
                    });
                    // Redraw Buttons for hover effect
                    if (gameState === 'start') drawStartScreen();
                    if (gameState === 'options') drawOptionsScreen();
                    if (gameState === 'win') showWinScreen();
                    if (gameState === 'lose') showLoseScreen();
                }
            });
            canvas._listenersAdded = true;
        }
    }
});

function drawStartScreen() {
    gameState = 'start';
    let bg = new Image();
    bg.src = 'assets/img/9_intro_outro_screens/start/startscreen_2.png';
    bg.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        drawMenuButtons();
    };
    // Buttons: Start, Optionen, Mute, Fullscreen
    let buttonWidth = 160;
    let buttonHeight = 50;
    let gap = 30;
    let totalWidth = buttonWidth * 3 + gap * 2;
    let startX = (canvas.width - totalWidth) / 2;
    let y = canvas.height - 120;
    menuButtons = [
        {
            text: 'Start',
            x: startX,
            y: y,
            w: buttonWidth,
            h: buttonHeight,
            onClick: () => {
                gameState = 'playing';
                menuButtons = [];
                startGame();
            }
        },
        {
            text: 'Optionen',
            x: startX + buttonWidth + gap,
            y: y,
            w: buttonWidth,
            h: buttonHeight,
            onClick: () => {
                drawOptionsScreen();
            }
        },
        {
            text: gameIsMuted ? 'Unmute' : 'Mute',
            x: startX + 2 * (buttonWidth + gap),
            y: y,
            w: buttonWidth,
            h: buttonHeight,
            onClick: () => {
                gameIsMuted = !gameIsMuted;
                drawStartScreen();
            }
        }
    ];
    // Fullscreen-Button oben rechts
    menuButtons.push({
        text: isFullscreen ? 'Kleiner Screen' : 'Fullscreen',
        x: canvas.width - 170,
        y: 20,
        w: 150,
        h: 40,
        onClick: toggleFullscreen
    });
    drawMenuButtons();
}

function drawMenuButtons() {
    menuButtons.forEach((btn, idx) => {
        ctx.save();
        // Hover-Effekt
        if (idx === hoveredButtonIndex) {
            ctx.fillStyle = "#388e3c";
        } else {
            ctx.fillStyle = "#43cea2";
        }
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect
            ? ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 14)
            : ctx.rect(btn.x, btn.y, btn.w, btn.h);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(btn.text, btn.x + btn.w / 2, btn.y + btn.h / 2);
        ctx.restore();
    });
}

// Entferne diese Zeilen komplett (sie sind jetzt doppelt und verursachen den Fehler!)
// canvas.addEventListener('mousemove', function(e) { ... });

function drawOptionsScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Optionen", canvas.width / 2, 100);
    ctx.font = "20px Arial";
    ctx.fillText("Hier könnten Optionen stehen.", canvas.width / 2, 180);
    // Zurück-Button
    menuButtons = [{
        text: "Zurück",
        x: canvas.width / 2 - 90,
        y: canvas.height - 100,
        w: 180,
        h: 60,
        onClick: () => {
            drawStartScreen();
        }
    }];
    drawMenuButtons();
}

function startGame() {
    canvas.classList.remove('fullscreen');
    canvas.width = 720;
    canvas.height = 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    world = new World(canvas, keyboard);
    world.showWinScreen = showWinScreen;
    world.showLoseScreen = showLoseScreen;
    if (world.character) world.character.loseScreenShown = false;
    if (gameIsMuted) {
        world.stopSounds && world.stopSounds(true);
        world.stopWinAndLostSound && world.stopWinAndLostSound(true);
    }
}

function showWinScreen() {
    gameState = 'win';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let img = new Image();
    img.src = 'assets/img/You won, you lost/You Win A.png';
    img.onload = () => {
        ctx.drawImage(img, (canvas.width - img.width * 0.6) / 2, (canvas.height - img.height * 0.6) / 2, img.width * 0.6, img.height * 0.6);
        drawWinLoseButtons();
    };
    menuButtons = [
        {
            text: 'Nochmal spielen',
            x: canvas.width / 2 - 180,
            y: canvas.height - 100,
            w: 160,
            h: 50,
            onClick: () => {
                drawStartScreen();
            }
        },
        {
            text: isFullscreen ? 'Kleiner Screen' : 'Fullscreen',
            x: canvas.width / 2 + 20,
            y: canvas.height - 100,
            w: 160,
            h: 50,
            onClick: toggleFullscreen
        }
    ];
}

function showLoseScreen() {
    gameState = 'lose';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let img = new Image();
    img.src = 'assets/img/9_intro_outro_screens/game_over/oh no you lost!.png';
    img.onload = () => {
        ctx.drawImage(img, (canvas.width - img.width * 0.6) / 2, (canvas.height - img.height * 0.6) / 2, img.width * 0.6, img.height * 0.6);
        drawWinLoseButtons();
    };
    menuButtons = [
        {
            text: 'Nochmal spielen',
            x: canvas.width / 2 - 180,
            y: canvas.height - 100,
            w: 160,
            h: 50,
            onClick: () => {
                if (world && world.character) world.character.loseScreenShown = false;
                startGame(); // <-- jetzt wirklich alles neu!
            }
        },
        {
            text: isFullscreen ? 'Kleiner Screen' : 'Fullscreen',
            x: canvas.width / 2 + 20,
            y: canvas.height - 100,
            w: 160,
            h: 50,
            onClick: toggleFullscreen
        }
    ];
}

function drawWinLoseButtons() {
    menuButtons.forEach(btn => {
        ctx.save();
        ctx.fillStyle = "#4caf50";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
        ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 22px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(btn.text, btn.x + btn.w / 2, btn.y + btn.h / 2);
        ctx.restore();
    });
}

function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    if (isFullscreen) {
        canvas.classList.add('fullscreen');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    } else {
        canvas.classList.remove('fullscreen');
        canvas.width = 720;
        canvas.height = 480;
    }
    if (gameState === 'start') drawStartScreen();
    if (gameState === 'win') showWinScreen();
    if (gameState === 'lose') showLoseScreen();
}

/**
 * Setzt den sichtbaren Screen je nach Spielstatus.
 * @param {'win'|'lose'|'start'} status
 */
function setGameScreen(status) {
    gameState = status;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (status === 'win') {
        showWinScreen();
    } else if (status === 'lose') {
        showLoseScreen();
    } else if (status === 'start') {
        drawStartScreen();
    }
}

// Beispiel für die Verwendung:
// setGameScreen('win');
// setGameScreen('lose');
// setGameScreen('start');

window.addEventListener('keydown', (event) => {
    if (event.key === 'f' || event.key === 'F') {
        toggleFullscreen();
    }
    if (gameState === 'playing') {
        if(event.keyCode == 39) keyboard.RIGHT = true;
        if(event.keyCode == 37) keyboard.LEFT = true;
        if(event.keyCode == 38) keyboard.UP = true;
        if(event.keyCode == 40) keyboard.DOWN = true;
        if(event.keyCode == 32) keyboard.SPACE = true;
        if(event.keyCode == 68) keyboard.D = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (gameState === 'playing') {
        if(event.keyCode == 39) keyboard.RIGHT = false;
        if(event.keyCode == 37) keyboard.LEFT = false;
        if(event.keyCode == 38) keyboard.UP = false;
        if(event.keyCode == 40) keyboard.DOWN = false;
        if(event.keyCode == 32) keyboard.SPACE = false;
        if(event.keyCode == 68) keyboard.D = false;
    }
});

function getIds() {
    return {
        startGameBtn: document.getElementById('start-game-btn'),
        playAgainBtn: document.getElementById('play-again-btn'),
        nextLevelBtn: document.getElementById('next-level-btn'),
        canvas: document.getElementById('canvas'),
        startScreen: document.getElementById('start-screen'),
        endScreen: document.getElementById('game-over-screen'),
        gameWinScreen: document.getElementById('game-win-screen')
    };
}

// Beispiel für Mute-Button
function getMute() {
    const muteImg = document.querySelector('.mute-img');
    if (world != undefined) {
        if (!gameIsMuted) {
            gameIsMuted = true;
            world.stopSounds(true);
            world.stopWinAndLostSound(true);
            muteImg && muteImg.classList.add('muted');
        } else {
            gameIsMuted = false;
            world.stopSounds(false);
            world.stopWinAndLostSound(false);
            muteImg && muteImg.classList.remove('muted');
        }
    }
}

function isMobileLandscape() {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) &&
        window.innerWidth > window.innerHeight;
}

function updateMobileBtnsVisibility() {
    const mobileBtns = document.getElementById('mobile-btns');
    if (mobileBtns) {
        if (isMobileLandscape()) {
            mobileBtns.style.display = 'block';
        } else {
            mobileBtns.style.display = 'none';
        }
    }
}

// Beim Start und bei jeder Größen-/Ausrichtungsänderung prüfen
window.addEventListener('DOMContentLoaded', updateMobileBtnsVisibility);
window.addEventListener('resize', updateMobileBtnsVisibility);
window.addEventListener('orientationchange', updateMobileBtnsVisibility);

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    updateMobileBtnsVisibility();
    if (ingameOptionsOverlay) ingameOptionsOverlay.classList.remove('d-none');
}
let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let gameIsMuted = false;
let gameState = 'start';
let menuButtons = [];
let isFullscreen = false;
let hoveredButtonIndex = -1;
let winSoundPlayed = false;
let loseSoundPlayed = false;
let optionsOrigin = null; // 'playing' | 'start' | null

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    loadAllSounds();
    setupCanvasListeners();
    setupMobileEvents();
    initMuteButton();
    initFullscreenButton();
    initOptionsTopButton();
    initOptionsCloseButton();
    initOptionsTabs(); // <-- neu: Tab-Eventbinding
    drawStartScreen();
}

// -> Definiere updateMobileBtnsVisibility früh, damit setupMobileEvents() es verwenden kann
function isMobileLandscape() {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) && window.innerWidth > window.innerHeight;
}
function updateMobileBtnsVisibility() {
    const mobileBtns = document.getElementById('mobile-btns');
    if (mobileBtns) mobileBtns.style.display = isMobileLandscape() ? 'block' : 'none';
}

function loadAllSounds() {
    SoundManager.load('jump', [{ src: 'audio/1_character/jump.mp3', type: 'audio/mpeg' }]);
    SoundManager.load('throw', [{ src: 'audio/4_bottle/throw.mp3', type: 'audio/mpeg' }]);
    SoundManager.load('break', [{ src: 'audio/4_bottle/break.mp3', type: 'audio/mpeg' }]);
    SoundManager.load('hurt', [{ src: 'audio/1_character/hurt.mp3', type: 'audio/mpeg' }]);
    SoundManager.load('lose', [{ src: 'audio/5_win_lose/lose.wav', type: 'audio/wav' }]);
    SoundManager.load('win', [{ src: 'audio/5_win_lose/win.wav', type: 'audio/wav' }]);
    SoundManager.load('gameplay', [{ src: 'audio/0_gameplay/gamesound.wav', type: 'audio/mpeg' }]);
    SoundManager.load('coin', [{ src: 'audio/3_coin/collect.wav', type: 'audio/wav' }]);
}

function setupCanvasListeners() {
    if (!canvas._listenersAdded) {
        canvas.addEventListener('click', handleMenuClick);
        canvas.addEventListener('mousemove', handleMenuHover);
        canvas._listenersAdded = true;
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

function setupMobileEvents() {
    updateMobileBtnsVisibility();
    window.addEventListener('resize', updateMobileBtnsVisibility);
    window.addEventListener('orientationchange', updateMobileBtnsVisibility);

    // Mobile button handlers (touch + mouse). Verwendet sprechende Event-Parameter.
    const controls = [
        { id: 'walk-left', key: 'LEFT' },
        { id: 'walk-right', key: 'RIGHT' },
        { id: 'jump', key: 'SPACE' },
        { id: 'throw', key: 'D' }
    ];

    controls.forEach(control => {
        const btn = document.getElementById(control.id);
        if (!btn) return;

        const setKeyState = (pressed) => { keyboard[control.key] = pressed; };

        // Touch events (mobile)
        btn.addEventListener('touchstart', function touchStartHandler(touchEvent) {
            touchEvent.preventDefault();
            setKeyState(true);
        }, { passive: false });
        btn.addEventListener('touchend', function touchEndHandler(touchEvent) {
            touchEvent.preventDefault();
            setKeyState(false);
        });
        btn.addEventListener('touchcancel', function touchCancelHandler(touchEvent) {
            touchEvent.preventDefault();
            setKeyState(false);
        });

        // Mouse events (desktop / testing)
        btn.addEventListener('mousedown', function mouseDownHandler(mouseEvent) {
            mouseEvent.preventDefault();
            setKeyState(true);
        });
        btn.addEventListener('mouseup', function mouseUpHandler(mouseEvent) {
            mouseEvent.preventDefault();
            setKeyState(false);
        });
        btn.addEventListener('mouseleave', function mouseLeaveHandler(mouseEvent) {
            mouseEvent.preventDefault();
            setKeyState(false);
        });
    });
}

function handleMenuClick(event) {
    let { x, y } = getMousePos(event);
    menuButtons.forEach(btn => {
        if (isPointInButton(x, y, btn)) btn.onClick();
    });
}

function handleMenuHover(event) {
    if (!['start', 'options'].includes(gameState)) return;
    let { x, y } = getMousePos(event);
    hoveredButtonIndex = -1;
    menuButtons.forEach((btn, idx) => {
        if (isPointInButton(x, y, btn)) hoveredButtonIndex = idx;
    });
    redrawMenuScreen();
}

function getMousePos(event) {
    let rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function isPointInButton(mx, my, btn) {
    return mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h;
}

function redrawMenuScreen() {
    if (gameState === 'start') drawStartScreen();
    if (gameState === 'options') drawOptionsScreen();
}

function handleKeyDown(event) {
    if (event.key === 'Escape') toggleFullscreen();
    if (gameState !== 'playing') return;
    setKeyState(event.keyCode, true);
}

function handleKeyUp(event) {
    if (gameState !== 'playing') return;
    setKeyState(event.keyCode, false);
}

function setKeyState(keyCode, state) {
    if (keyCode === 37) keyboard.LEFT = state;
    if (keyCode === 38) keyboard.UP = state;
    if (keyCode === 39) keyboard.RIGHT = state;
    if (keyCode === 40) keyboard.DOWN = state;
    if (keyCode === 32) keyboard.SPACE = state;
    if (keyCode === 68) keyboard.D = state;
}

function drawStartScreen() {
    gameState = 'start';
    let bg = new Image();
    bg.src = 'assets/img/9_intro_outro_screens/start/startscreen_2.png';
    bg.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        setupStartMenuButtons();
        drawMenuButtons();
    };
}

function setupStartMenuButtons() {
    let w = 160, h = 50, gap = 30;
    let totalW = w; // nur ein Button (Start)
    let x = (canvas.width - totalW) / 2;
    let y = canvas.height - 120;
    menuButtons = [
        { 
            text: 'Start', 
            x, 
            y, 
            w, 
            h, 
            onClick: () => { 
                gameState = 'playing'; 
                menuButtons = []; 
                startGame(); 
            } 
        }
        // Optionen über #options-top-btn (persistentes Icon)
    ];
}

function initOptionsTopButton() {
    const optBtn = document.getElementById('options-top-btn');
    if (!optBtn) return;
    const img = optBtn.querySelector('img');
    if (img) img.src = 'assets/img/10_button_icons/options.png';
    optBtn.addEventListener('click', () => {
        if (gameState === 'playing' && world) {
            optionsOrigin = 'playing';
            openOptionsFromGameplay();
        } else {
            optionsOrigin = 'start';
            showOptionsModal();
        }
    });
}

// Neues: bindet Close-Icon im Modal an closeOptions()
function initOptionsCloseButton() {
    // alter Selektor '#close-game-description' wurde ersetzt durch '#options-close-btn'
    const closeBtn = document.getElementById('options-close-btn');
    if (!closeBtn) return;
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeOptions();
    });
}

// Tab-Logik für Options-Modal
function initOptionsTabs() {
    const tabs = [
        { btnId: 'tab-story', paneId: 'story-content' },
        { btnId: 'tab-controls', paneId: 'controls-content' },
        { btnId: 'tab-imprint', paneId: 'imprint-content' },
        { btnId: 'tab-privacy', paneId: 'privacy-content' }
    ];
    tabs.forEach(t => {
        const btn = document.getElementById(t.btnId);
        if (!btn) return;
        btn.addEventListener('click', (e) => {
            // Wenn Link verwendet wird: Navigation verhindern, Tab wechseln
            if (e && typeof e.preventDefault === 'function') e.preventDefault();
            switchOptionsTab(t.btnId, t.paneId);
        });
    });
}

// Wechselt Tab: setzt aktive Klasse am Button und zeigt das Pane
function switchOptionsTab(activeBtnId, activePaneId) {
    // buttons
    document.querySelectorAll('.tab-btn').forEach(b => {
        if (b.id === activeBtnId) {
            b.classList.add('active');
            b.setAttribute('aria-selected', 'true');
        } else {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        }
    });
    // panes
    document.querySelectorAll('.tab-content').forEach(p => {
        if (p.id === activePaneId) p.classList.remove('d-none');
        else p.classList.add('d-none');
    });
}

// Im showOptionsModal standardmäßig Story öffnen
function showOptionsModal() {
    gameState = 'options';
    const modal = document.getElementById('options-modal');
    if (!modal) return;

    const wasHidden = modal.classList.contains('d-none'); // merken ob Modal gerade geöffnet wird

    modal.classList.remove('d-none');
    // remove overlay-screen to keep modal INSIDE the canvas/container
    // modal.classList.add('overlay-screen');  // <-- entfernt
    modal.classList.add('fredoka-ui');

    const containerEl = document.querySelector('.container');
    if (containerEl) containerEl.classList.add('modal-open');

    // Nur beim echten Öffnen das Story-Tab als Default setzen.
    if (wasHidden) {
        const anyVisible = Array.from(document.querySelectorAll('.tab-content')).some(p => !p.classList.contains('d-none'));
        if (!anyVisible) switchOptionsTab('tab-story', 'story-content');
    }
}

// Anpassung: openOptionsFromGameplay pausiert weiterhin das Spiel und zeigt Modal
function openOptionsFromGameplay() {
    if (!world) { showOptionsModal(); return; }
    try { world.clearAllIntervals(); } catch(e) { /* ignore */ }
    world.gameStopped = true;
    SoundManager.stopGameplay();
    showOptionsModal();
}

// Beim Schließen Modal verbergen und Spielzustand wiederherstellen
function closeOptions() {
    // hide modal
    const modal = document.getElementById('options-modal');
    if (modal) {
        modal.classList.add('d-none');
        // modal.classList.remove('overlay-screen'); // <-- entfernt (war nicht nötig)
        modal.classList.remove('fredoka-ui');
    }

    // Neuer: container-Klasse entfernen
    const containerEl = document.querySelector('.container');
    if (containerEl) containerEl.classList.remove('modal-open');

    if (optionsOrigin === 'playing' && world) {
        // Resume game
        world.gameStopped = false;
        if (typeof world.run === 'function') world.run();
        if (typeof world.draw === 'function') world.draw();
        gameState = 'playing';
        if (!gameIsMuted) SoundManager.playGameplay();
    } else {
        drawStartScreen();
    }
    optionsOrigin = null;
}

// ====================== SCREENS ======================
// Ersetze canvas-basierte drawOptionsScreen: jetzt zeigt Modal
function drawOptionsScreen() {
    // delegated to modal display (kept for backward compatibility)
    showOptionsModal();
}

function showWinScreen() {
    gameState = 'win';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    SoundManager.stopGameplay();
    if (!gameIsMuted && !winSoundPlayed) { SoundManager.playWin(); winSoundPlayed = true; }
    let img = new Image();
    img.src = 'assets/img/You won, you lost/You Win A.png';
    img.onload = () => { drawEndScreen(img, 'win'); };
}

function showLoseScreen() {
    gameState = 'lose';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    SoundManager.stopGameplay();
    if (!gameIsMuted && !loseSoundPlayed) { SoundManager.playLose(); loseSoundPlayed = true; }
    let img = new Image();
    img.src = 'assets/img/9_intro_outro_screens/game_over/oh no you lost!.png';
    img.onload = () => { drawEndScreen(img, 'lose'); };
}

function drawEndScreen(img, type) {
    let opacity = 0, scale = 1.2;
    let w = img.width * 0.6, h = img.height * 0.6;
    let x = (canvas.width - w) / 2, y = (canvas.height - h) / 2;
    let fadeInterval = setInterval(() => {
        drawEndScreenFrame(img, x, y, w, h, opacity, scale);
        if (opacity < 1) opacity += 0.04;
        if (scale > 1) scale -= 0.02;
        if (opacity >= 1 && scale <= 1) {
            clearInterval(fadeInterval);
            setupWinLoseButtons(type);
            drawWinLoseButtons();
        }
    }, 50);
}

function drawEndScreenFrame(img, x, y, w, h, opacity, scale) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let drawW = w * scale, drawH = h * scale;
    let drawX = x - (drawW - w) / 2, drawY = y - (drawH - h) / 2;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.globalAlpha = 1;
}

function setupWinLoseButtons(type) {
    let w = 200, h = 55, gap = 25;
    let totalW = w * 3 + gap * 2;
    let x = (canvas.width - totalW) / 2;
    let y = canvas.height - 120;
    menuButtons = [
        { text: type === 'win' ? 'Nochmal spielen' : 'Nochmal versuchen', x, y, w, h, onClick: () => { winSoundPlayed = false; loseSoundPlayed = false; drawStartScreen(); } },
        { text: 'Zurück zum Menü', x: x + w + gap, y, w, h, onClick: drawStartScreen },
        { text: isFullscreen ? 'Kleiner Screen' : 'Fullscreen', x: x + 2 * (w + gap), y, w, h, onClick: toggleFullscreen }
    ];
}

function drawMenuButtons() {
    menuButtons.forEach((btn, idx) => drawButton(btn, idx, "#388e3c", "#43cea2", 14));
}

function drawWinLoseButtons() {
    menuButtons.forEach(btn => drawButton(btn, -1, "#4caf50", "#4caf50", 12));
}

function drawButton(btn, idx, hoverColor, normalColor, radius) {
    ctx.save();
    ctx.fillStyle = (idx === hoveredButtonIndex) ? hoverColor : normalColor;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(btn.x, btn.y, btn.w, btn.h, radius) : ctx.rect(btn.x, btn.y, btn.w, btn.h);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(btn.text, btn.x + btn.w / 2, btn.y + btn.h / 2);
    ctx.restore();
}

function startGame() {
    if (world) world.clearAllIntervals(); 
    canvas.classList.remove('fullscreen');
    canvas.width = 720; 
    canvas.height = 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    world = new World(canvas, keyboard);
    world.showWinScreen = showWinScreen;
    world.showLoseScreen = showLoseScreen;
    if (world.character) world.character.loseScreenShown = false;
    gameState = 'playing';
    if (!gameIsMuted) SoundManager.playGameplay();
}

// Toggle global fullscreen and update icons
function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    const containerEl = document.querySelector('.container');
    if (isFullscreen) {
        // container als fullscreen markieren (verhindert Verschiebung durch vorherige Zentrierung)
        if (containerEl) containerEl.classList.add('fullscreen');

        // Canvas als fixed full-viewport darstellen
        canvas.classList.add('fullscreen');
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    } else {
        // zurücksetzen
        if (containerEl) containerEl.classList.remove('fullscreen');

        canvas.classList.remove('fullscreen');
        canvas.style.width = '720px';
        canvas.style.height = '480px';
        canvas.width = 720;
        canvas.height = 480;

        // Stelle sicher, dass Container wieder zentriert bleibt (CSS übernimmt)
    }

    // optional: update fullscreen-button icon (keine Änderung am src in dieser Version)
    const fsImg = document.querySelector('#fullscreen-btn img');
    if (fsImg) {
        fsImg.src = 'assets/img/10_button_icons/fullscreen.png';
    }

    // redraw menus falls nötig
    if (gameState === 'start') drawStartScreen();
    if (gameState === 'win') showWinScreen();
    if (gameState === 'lose') showLoseScreen();
}

// Initialisiert Fullscreen-Button-Icon and Listener
function initFullscreenButton() {
    const fsBtn = document.getElementById('fullscreen-btn');
    if (!fsBtn) return;
    const img = fsBtn.querySelector('img');
    if (img) img.src = 'assets/img/10_button_icons/fullscreen.png';
    fsBtn.addEventListener('click', () => {
        toggleFullscreen();
    });
}

function toggleMute() {
    gameIsMuted = !gameIsMuted;
    if (gameIsMuted) {
        SoundManager.stopAll();
    } else {
        if (gameState === 'playing') SoundManager.playGameplay();
    }
    const muteBtnImg = document.querySelector('#mute-btn img');
    if (muteBtnImg) {
        muteBtnImg.src = gameIsMuted ? 'assets/img/10_button_icons/mute.png' : 'assets/img/10_button_icons/volume.png';
    }
    const ingameAudioImg = document.querySelector('#audio-btn img');
    if (ingameAudioImg) {
        ingameAudioImg.src = gameIsMuted ? 'assets/img/10_button_icons/mute.png' : 'assets/img/10_button_icons/volume.png';
    }
}


function initMuteButton() {
    const muteBtn = document.getElementById('mute-btn');
    if (!muteBtn) return;
    const img = muteBtn.querySelector('img');
    if (img) img.src = gameIsMuted ? 'assets/img/10_button_icons/mute.png' : 'assets/img/10_button_icons/volume.png';
    muteBtn.addEventListener('click', function onMuteClick() {
        toggleMute();
    });
    const ingameAudioBtn = document.getElementById('audio-btn');
    if (ingameAudioBtn) {
        ingameAudioBtn.addEventListener('click', function onIngameAudioClick() {
            toggleMute();
        });
        const inImg = ingameAudioBtn.querySelector('img');
        if (inImg) inImg.src = gameIsMuted ? 'assets/img/10_button_icons/mute.png' : 'assets/img/10_button_icons/volume.png';
    }
}


window.addEventListener('DOMContentLoaded', init);
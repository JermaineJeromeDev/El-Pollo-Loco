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
let optionsOrigin = null;
let endScreenImage = null;

/**
 * Initialisiert das Spiel
 */
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
    initOptionsTabs();
    
    updateIconPositions();
    updateRotateHint();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', updateRotateHint);
    
    drawStartScreen();
}

/**
 * Behandelt Resize-Events
 */
function handleResize() {
    updateIconPositions();
    updateRotateHint();
}

/**
 * Lädt alle Sound-Dateien
 */
function loadAllSounds() {
    const sounds = [
        { name: 'jump', src: 'assets/audio/1_character/jump.mp3' },
        { name: 'throw', src: 'assets/audio/4_bottle/throw.mp3' },
        { name: 'break', src: 'assets/audio/4_bottle/break.mp3' },
        { name: 'hurt', src: 'assets/audio/1_character/hurt.mp3' },
        { name: 'lose', src: 'assets/audio/5_win_lose/lose.wav' },
        { name: 'win', src: 'assets/audio/5_win_lose/win.wav' },
        { name: 'gameplay', src: 'assets/audio/0_gameplay/gamesound.wav' },
        { name: 'coin', src: 'assets/audio/3_coin/collect.wav' }
    ];
    
    sounds.forEach(sound => {
        const type = sound.src.endsWith('.wav') ? 'audio/wav' : 'audio/mpeg';
        SoundManager.load(sound.name, [{ src: sound.src, type }]);
    });
}

/**
 * Startet ein neues Spiel
 */
function startGame() {
    cleanupOldWorld();
    resetCanvas();
    createNewWorld();
    
    gameState = 'playing';
    
    if (!gameIsMuted) {
        setTimeout(() => SoundManager.playGameplay(), 100);
    }
}

/**
 * Räumt alte World-Instanz auf
 */
function cleanupOldWorld() {
    if (!world) return;
    
    world.clearAllIntervals();
    world.gameStopped = true;
    world = null;
}

/**
 * Setzt Canvas auf Standardgröße zurück
 */
function resetCanvas() {
    canvas.classList.remove('fullscreen');
    canvas.width = 720; 
    canvas.height = 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Erstellt neue World-Instanz
 */
function createNewWorld() {
    world = new World(canvas, keyboard);
    world.showWinScreen = showWinScreen;
    world.showLoseScreen = showLoseScreen;
    
    if (world.character) {
        world.character.loseScreenShown = false;
    }
}

/**
 * Zeichnet den Start-Screen
 */
function drawStartScreen() {
    gameState = 'start';
    
    const bg = new Image();
    bg.src = 'assets/img/9_intro_outro_screens/start/startscreen_2.png';
    bg.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawScaledBackground(bg);
        setupStartMenuButtons();
        drawMenuButtons();
    };
}

/**
 * Zeichnet Hintergrundbild skaliert
 * @param {Image} img - Das zu zeichnende Bild
 */
function drawScaledBackground(img) {
    const imgAspect = img.width / img.height;
    const canvasAspect = canvas.width / canvas.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (canvasAspect > imgAspect) {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgAspect;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgAspect;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
    }
    
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

/**
 * Zeigt den Gewinnbildschirm an
 */
function showWinScreen() {
    gameState = 'win';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    SoundManager.stopGameplay();
    if (!gameIsMuted && !winSoundPlayed) { SoundManager.playWin(); winSoundPlayed = true; }
    let img = new Image();
    img.src = 'assets/img/You won, you lost/You win B.png';
    img.onload = () => { drawEndScreen(img, 'win'); };
}

/**
 * Zeigt den Verlustbildschirm an
 */
function showLoseScreen() {
    gameState = 'lose';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    SoundManager.stopGameplay();
    if (!gameIsMuted && !loseSoundPlayed) { SoundManager.playLose(); loseSoundPlayed = true; }
    let img = new Image();
    img.src = 'assets/img/You won, you lost/You lost.png';
    img.onload = () => { drawEndScreen(img, 'lose'); };
}

/**
 * Zeichnet den Endbildschirm
 * @param {Image} img - Das zu zeichnende Bild
 * @param {string} type - 'win' oder 'lose'
 */
function drawEndScreen(img, type) {
    endScreenImage = img;
    const dimensions = calculateImageDimensions(img);
    startFadeInAnimation(img, dimensions, type);
}

/**
 * Berechnet Bilddimensionen für Endbildschirm
 * @param {Image} img - Das Bild
 * @returns {Object} Dimensionen {x, y, w, h}
 */
function calculateImageDimensions(img) {
    const maxWidth = canvas.width * 0.6;
    const maxHeight = canvas.height * 0.6;
    const imgAspect = img.width / img.height;
    
    let w, h;
    if (maxWidth / imgAspect <= maxHeight) {
        w = maxWidth;
        h = maxWidth / imgAspect;
    } else {
        h = maxHeight;
        w = maxHeight * imgAspect;
    }
    
    return {
        x: (canvas.width - w) / 2,
        y: (canvas.height - h) / 2,
        w,
        h
    };
}

/**
 * Startet Fade-In Animation
 * @param {Image} img - Das Bild
 * @param {Object} dimensions - Dimensionen
 * @param {string} type - 'win' oder 'lose'
 */
function startFadeInAnimation(img, dimensions, type) {
    let opacity = 0;
    let scale = 1.2;
    
    const fadeInterval = setInterval(() => {
        drawEndScreenFrame(img, dimensions, opacity, scale);
        opacity = Math.min(1, opacity + 0.04);
        scale = Math.max(1, scale - 0.02);
        
        if (opacity >= 1 && scale <= 1) {
            clearInterval(fadeInterval);
            finishEndScreen(type);
        }
    }, 50);
}

/**
 * Beendet Endbildschirm-Animation
 * @param {string} type - 'win' oder 'lose'
 */
function finishEndScreen(type) {
    setupWinLoseButtons(type);
    drawWinLoseButtons();
    gameState = type;
}

/**
 * Zeichnet einen Frame des Endbildschirms
 * @param {Image} img - Das Bild
 * @param {Object} dimensions - {x, y, w, h}
 * @param {number} opacity - Opazität
 * @param {number} scale - Skalierung
 */
function drawEndScreenFrame(img, dimensions, opacity, scale) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = opacity;
    
    const drawW = dimensions.w * scale;
    const drawH = dimensions.h * scale;
    const drawX = dimensions.x - (drawW - dimensions.w) / 2;
    const drawY = dimensions.y - (drawH - dimensions.h) / 2;
    
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.globalAlpha = 1;
}

/**
 * Setzt die Start-Menü-Buttons
 */
function setupStartMenuButtons() {
    let w = Math.min(200, canvas.width * 0.3); // max 200px oder 30% der Canvas-Breite
    let h = 60;
    let x = (canvas.width - w) / 2;
    let y = Math.max(60, canvas.height * 0.125); // min 60px oder 12.5% der Canvas-Höhe
    
    menuButtons = [
        { 
            text: 'Start Game', 
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
    ];
}

/**
 * Initialisiert den Optionen-Button im oberen Bereich
 */
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

/**
 * Neues: bindet Close-Icon im Modal an closeOptions()
 */
function initOptionsCloseButton() {
    const closeBtn = document.getElementById('options-close-btn');
    if (!closeBtn) return;
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeOptions();
    });
}

/**
 * Tab-Logik für Options-Modal
 */
function initOptionsTabs() {
    const tabs = [
        { btnId: 'tab-story', paneId: 'story-content' },
        { btnId: 'tab-controls', paneId: 'controls-content' },
        { btnId: 'tab-back-menu', action: 'backToMenu' }, // NEU: Back to Menu Action
        { btnId: 'tab-imprint', paneId: 'imprint-content' },
        { btnId: 'tab-privacy', paneId: 'privacy-content' }
    ];
    tabs.forEach(t => {
        const btn = document.getElementById(t.btnId);
        if (!btn) return;
        btn.addEventListener('click', (e) => {
            // Wenn Link mit target="_blank" → normale Navigation erlauben
            if (btn.tagName === 'A' && btn.getAttribute('target') === '_blank') {
                document.querySelectorAll('.tab-btn').forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                return;
            }
            
            // NEU: Wenn "Zurück zum Menü" Button
            if (t.action === 'backToMenu') {
                e.preventDefault();
                handleBackToMenu();
                return;
            }
            
            // Ansonsten: Navigation verhindern, Tab wechseln
            if (e && typeof e.preventDefault === 'function') e.preventDefault();
            switchOptionsTab(t.btnId, t.paneId);
        });
    });
}

/**
 * NEU: Funktion für "Zurück zum Menü"
 */
function handleBackToMenu() {
    // Schließe das Options-Modal
    const modal = document.getElementById('options-modal');
    if (modal) {
        modal.classList.add('d-none');
        modal.classList.remove('fredoka-ui');
    }
    
    const containerEl = document.querySelector('.container');
    if (containerEl) containerEl.classList.remove('modal-open');
    
    // Stoppe das Spiel falls es läuft
    if (world) {
        world.clearAllIntervals();
        world.gameStopped = true;
        world = null;
    }
    
    // Stoppe alle Sounds
    SoundManager.stopAll();
    
    // Reset game state
    gameState = 'start';
    optionsOrigin = null;
    winSoundPlayed = false;
    loseSoundPlayed = false;
    endScreenImage = null;
    
    // Zeige Startscreen
    drawStartScreen();
}

/**
 * Wechselt Tab: setzt aktive Klasse am Button und zeigt das Pane
 * @param {string} activeBtnId - ID des aktiven Buttons
 * @param {string} activePaneId - ID des aktiven Panes
 */
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

/**
 * Im showOptionsModal standardmäßig Story öffnen
 */
function showOptionsModal() {
    gameState = 'options';
    const modal = document.getElementById('options-modal');
    if (!modal) return;

    const wasHidden = modal.classList.contains('d-none');

    modal.classList.remove('d-none');
    modal.classList.add('fredoka-ui');

    const containerEl = document.querySelector('.container');
    if (containerEl) containerEl.classList.add('modal-open');

    if (wasHidden) {
        const anyVisible = Array.from(document.querySelectorAll('.tab-content')).some(p => !p.classList.contains('d-none'));
        if (!anyVisible) switchOptionsTab('tab-story', 'story-content');
    }
}

/**
 * Anpassung: openOptionsFromGameplay pausiert weiterhin das Spiel und zeigt Modal
 */
function openOptionsFromGameplay() {
    if (!world) { showOptionsModal(); return; }
    try { world.clearAllIntervals(); } catch(e) { /* ignore */ }
    world.gameStopped = true;
    SoundManager.stopGameplay();
    showOptionsModal();
}

/**
 * Beim Schließen Modal verbergen und Spielzustand wiederherstellen
 */
function closeOptions() {
    const modal = document.getElementById('options-modal');
    if (modal) {
        modal.classList.add('d-none');
        modal.classList.remove('fredoka-ui');
    }

    const containerEl = document.querySelector('.container');
    if (containerEl) containerEl.classList.remove('modal-open');

    if (optionsOrigin === 'playing' && world) {
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

/**
 * Setzt Canvas-Listener für Menu-Interaktionen
 */
function setupCanvasListeners() {
    if (!canvas._listenersAdded) {
        canvas.addEventListener('click', handleMenuClick);
        canvas.addEventListener('touchstart', handleMenuTouch, { passive: false });
        canvas.addEventListener('mousemove', handleMenuHover);
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas._listenersAdded = true;
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

/**
 * Behandelt Menu-Klicks
 */
function handleMenuClick(event) {
    let { x, y } = getMousePos(event);
    menuButtons.forEach(btn => {
        if (isPointInButton(x, y, btn)) btn.onClick();
    });
}

/**
 * Behandelt Menu-Hover
 */
function handleMenuHover(event) {
    if (!['start', 'win', 'lose'].includes(gameState)) return;
    let { x, y } = getMousePos(event);
    hoveredButtonIndex = -1;
    menuButtons.forEach((btn, idx) => {
        if (isPointInButton(x, y, btn)) hoveredButtonIndex = idx;
    });
    redrawMenuScreen();
}

/**
 * Behandelt Menu-Touch
 */
function handleMenuTouch(event) {
    event.preventDefault();
    let touch = event.touches[0];
    if (!touch) return;
    
    let rect = canvas.getBoundingClientRect();
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;
    
    menuButtons.forEach(btn => {
        if (isPointInButton(x, y, btn)) btn.onClick();
    });
}

/**
 * Behandelt Touch-Move Events
 */
function handleTouchMove(event) {
    if (!['start', 'win', 'lose'].includes(gameState)) return;
    event.preventDefault();
    let touch = event.touches[0];
    if (!touch) return;
    
    let rect = canvas.getBoundingClientRect();
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;
    
    hoveredButtonIndex = -1;
    menuButtons.forEach((btn, idx) => {
        if (isPointInButton(x, y, btn)) hoveredButtonIndex = idx;
    });
    redrawMenuScreen();
}

/**
 * Holt Maus-Position relativ zum Canvas
 */
function getMousePos(event) {
    let rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

/**
 * Prüft ob Punkt in Button ist
 */
function isPointInButton(mx, my, btn) {
    return mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h;
}

/**
 * Zeichnet Menu-Screen neu
 */
function redrawMenuScreen() {
    if (gameState === 'start') drawStartScreen();
    if (gameState === 'win' || gameState === 'lose') redrawEndScreen();
}

/**
 * Zeichnet End-Screen neu
 */
function redrawEndScreen() {
    if (!endScreenImage) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dimensions = calculateImageDimensions(endScreenImage);
    ctx.drawImage(endScreenImage, dimensions.x, dimensions.y, dimensions.w, dimensions.h);
    drawWinLoseButtons();
}

/**
 * Setzt Win/Lose Buttons
 */
function setupWinLoseButtons(type) {
    let w = Math.min(200, canvas.width * 0.25);
    let h = 60;
    let spacing = (canvas.width - (w * 2)) / 3;
    
    menuButtons = [
        { 
            text: 'Restart', 
            x: spacing, 
            y: Math.max(75, canvas.height * 0.15), 
            w, 
            h, 
            onClick: () => { 
                winSoundPlayed = false; 
                loseSoundPlayed = false; 
                endScreenImage = null;
                startGame(); 
            } 
        },
        { 
            text: 'Back to Menu', 
            x: spacing + w + spacing, 
            y: Math.max(75, canvas.height * 0.15), 
            w, 
            h, 
            onClick: () => {
                winSoundPlayed = false;
                loseSoundPlayed = false;
                endScreenImage = null;
                drawStartScreen();
            }
        }
    ];
}

/**
 * Zeichnet Menu-Buttons
 */
function drawMenuButtons() {
    menuButtons.forEach((btn, idx) => drawButton(btn, idx));
}

/**
 * Zeichnet Win/Lose-Buttons
 */
function drawWinLoseButtons() {
    menuButtons.forEach((btn, idx) => drawButton(btn, idx));
}

/**
 * Zeichnet einzelnen Button
 */
function drawButton(btn, idx) {
    ctx.save();
    
    ctx.fillStyle = (idx === hoveredButtonIndex) ? "#FFD700" : "#FFA500";
    let fontSize = Math.min(38, Math.max(24, canvas.width / 20));
    ctx.font = `bold ${fontSize}px 'Luckiest Guy', cursive`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    ctx.fillText(btn.text, btn.x + btn.w / 2, btn.y + btn.h / 2);
    ctx.restore();
}

/**
 * Setzt Mobile-Events
 */
function setupMobileEvents() {
    updateMobileBtnsVisibility();
    window.addEventListener('resize', updateMobileBtnsVisibility);
    window.addEventListener('orientationchange', updateMobileBtnsVisibility);

    const controls = [
        { id: 'walk-left', key: 'LEFT' },
        { id: 'walk-right', key: 'RIGHT' },
        { id: 'jump', key: 'SPACE' },
        { id: 'throw', key: 'D' }
    ];

    controls.forEach(control => {
        const btn = document.getElementById(control.id);
        if (!btn) return;
        
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keyboard[control.key] = true;
        }, { passive: false });
        
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            keyboard[control.key] = false;
        });
    });
}

/**
 * Prüft ob Mobile Landscape
 */
function isMobileLandscape() {
    return window.innerWidth <= 667 && window.innerHeight <= 375 && window.innerWidth > window.innerHeight;
}

/**
 * Aktualisiert Mobile-Button-Sichtbarkeit
 */
function updateMobileBtnsVisibility() {
    const mobileBtns = document.getElementById('mobile-btns');
    if (mobileBtns) {
        mobileBtns.style.display = isMobileLandscape() ? 'block' : 'none';
    }
}

/**
 * Behandelt Keydown
 */
function handleKeyDown(event) {
    if (event.key === 'Escape') toggleFullscreen();
    if (gameState !== 'playing') return;
    setKeyState(event.keyCode, true);
}

/**
 * Behandelt Keyup
 */
function handleKeyUp(event) {
    if (gameState !== 'playing') return;
    setKeyState(event.keyCode, false);
}

/**
 * Setzt Keyboard-Status
 */
function setKeyState(keyCode, state) {
    if (keyCode === 37) keyboard.LEFT = state;
    if (keyCode === 39) keyboard.RIGHT = state;
    if (keyCode === 32) keyboard.SPACE = state;
    if (keyCode === 68) keyboard.D = state;
}

/**
 * Initialisiert Fullscreen-Button
 */
function initFullscreenButton() {
    const fsBtn = document.getElementById('fullscreen-btn');
    if (!fsBtn) return;
    fsBtn.addEventListener('click', toggleFullscreen);
}

/**
 * Togglet Fullscreen-Modus
 */
function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    const containerEl = document.querySelector('.container');
    
    if (isFullscreen) {
        if (containerEl) containerEl.classList.add('fullscreen');
        canvas.classList.add('fullscreen');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    } else {
        if (containerEl) containerEl.classList.remove('fullscreen');
        canvas.classList.remove('fullscreen');
        canvas.width = 720;
        canvas.height = 480;
    }
    
    updateIconPositions();
    if (gameState === 'start') drawStartScreen();
    if (world && world.draw) requestAnimationFrame(() => world.draw());
}

window.addEventListener('DOMContentLoaded', init);
// ====================== SCREENS ======================
// Ersetze canvas-basierte drawOptionsScreen: jetzt zeigt Modal
function drawOptionsScreen() {
    // delegated to modal display (kept for backward compatibility)
    showOptionsModal();
}
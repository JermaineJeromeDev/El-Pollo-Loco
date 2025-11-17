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
let endScreenImage = null; // NEU: Speichert das End-Screen-Bild

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
    updateIconPositions(); // Initial positioning
    updateRotateHint(); // NEU: Initial check
    window.addEventListener('resize', () => {
        updateIconPositions();
        updateRotateHint(); // NEU: Bei Resize prüfen
    });
    window.addEventListener('orientationchange', updateRotateHint); // NEU: Bei Rotation prüfen
    drawStartScreen();
}

// Neue Funktion: Aktualisiert Icon-Positionen basierend auf Canvas-Größe
function updateIconPositions() {
    const containerEl = document.querySelector('.container');
    const topControls = document.querySelector('.top-controls');
    if (!containerEl || !topControls) return;

    const canvasRect = canvas.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();

    // Positioniere top-controls relativ zum Canvas
    const topOffset = canvasRect.top - containerRect.top + 8; // 8px vom Canvas-Rand
    const rightOffset = containerRect.right - canvasRect.right + 8; // 8px vom Canvas-Rand rechts
    
    topControls.style.top = `${topOffset}px`;
    topControls.style.right = `${rightOffset}px`;
}

function loadAllSounds() {
    SoundManager.load('jump', [{ src: 'assets/audio/1_character/jump.mp3', type: 'audio/mpeg' }]);
    SoundManager.load('throw', [{ src: 'assets/audio/4_bottle/throw.mp3', type: 'audio/mpeg' }]);
    SoundManager.load('break', [{ src: 'assets/audio/4_bottle/break.mp3', type: 'audio/mpeg' }]);
    SoundManager.load('hurt', [{ src: 'assets/audio/1_character/hurt.mp3', type: 'audio/mpeg' }]);
    SoundManager.load('lose', [{ src: 'assets/audio/5_win_lose/lose.wav', type: 'audio/wav' }]);
    SoundManager.load('win', [{ src: 'assets/audio/5_win_lose/win.wav', type: 'audio/wav' }]);
    SoundManager.load('gameplay', [{ src: 'assets/audio/0_gameplay/gamesound.wav', type: 'audio/mpeg' }]);
    SoundManager.load('coin', [{ src: 'assets/audio/3_coin/collect.wav', type: 'audio/wav' }]);
}

function handleMenuClick(event) {
    let { x, y } = getMousePos(event);
    menuButtons.forEach(btn => {
        if (isPointInButton(x, y, btn)) btn.onClick();
    });
}

function handleMenuHover(event) {
    if (!['start', 'win', 'lose', 'options'].includes(gameState)) return;
    let { x, y } = getMousePos(event);
    hoveredButtonIndex = -1;
    menuButtons.forEach((btn, idx) => {
        if (isPointInButton(x, y, btn)) hoveredButtonIndex = idx;
    });
    redrawMenuScreen();
}

function handleMenuTouch(event) {
    event.preventDefault();
    let touch = event.touches[0];
    if (!touch) return;
    
    let rect = canvas.getBoundingClientRect();
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;
    
    menuButtons.forEach(btn => {
        if (isPointInButton(x, y, btn)) {
            btn.onClick();
        }
    });
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
    // NEU: Win/Lose-Screens komplett neu zeichnen
    if (gameState === 'win' || gameState === 'lose') {
        redrawEndScreen();
    }
}

// NEU: Zeichnet End-Screen mit gespeichertem Bild neu
function redrawEndScreen() {
    if (!endScreenImage) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Kein schwarzer Hintergrund - nur transparentes Canvas
    
    // Dynamische Bildgröße basierend auf Canvas
    let maxWidth = canvas.width * 0.6;
    let maxHeight = canvas.height * 0.6;
    let imgAspect = endScreenImage.width / endScreenImage.height;
    
    let w, h;
    if (maxWidth / imgAspect <= maxHeight) {
        w = maxWidth;
        h = maxWidth / imgAspect;
    } else {
        h = maxHeight;
        w = maxHeight * imgAspect;
    }
    
    let x = (canvas.width - w) / 2;
    let y = (canvas.height - h) / 2;
    
    ctx.drawImage(endScreenImage, x, y, w, h);
    drawWinLoseButtons();
}

function setupCanvasListeners() {
    if (!canvas._listenersAdded) {
        canvas.addEventListener('click', handleMenuClick);
        canvas.addEventListener('touchstart', handleMenuTouch, { passive: false });
        canvas.addEventListener('mousemove', handleMenuHover);
        
        canvas.addEventListener('touchmove', function handleTouchMove(event) {
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
            
            // NEU: Verwende redrawMenuScreen statt direkt drawWinLoseButtons
            redrawMenuScreen();
        }, { passive: false });
        
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

// -> Definiere updateMobileBtnsVisibility früh, damit setupMobileEvents() es verwenden kann
function isMobileLandscape() {
    const isSmallViewport = window.innerWidth <= 667 && window.innerHeight <= 375;
    const isLandscape = window.innerWidth > window.innerHeight;
    return isSmallViewport && isLandscape;
}

function updateMobileBtnsVisibility() {
    const mobileBtns = document.getElementById('mobile-btns');
    if (mobileBtns) {
        mobileBtns.style.display = isMobileLandscape() ? 'block' : 'none';
    }
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
        // Bild skaliert und horizontal zentriert zeichnen
        drawScaledBackground(bg);
        setupStartMenuButtons();
        drawMenuButtons();
    };
}

function drawScaledBackground(img) {
    // Bild im "cover"-Modus: füllt Canvas komplett aus, behält Aspect Ratio
    let imgAspect = img.width / img.height;
    let canvasAspect = canvas.width / canvas.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    // Cover-Modus: Bild füllt Canvas komplett, ohne transparente Bereiche
    if (canvasAspect > imgAspect) {
        // Canvas ist breiter → Bild auf Canvas-Breite skalieren
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgAspect;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        // Canvas ist höher → Bild auf Canvas-Höhe skalieren
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgAspect;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
    }
    
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

function showWinScreen() {
    gameState = 'win';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    SoundManager.stopGameplay();
    if (!gameIsMuted && !winSoundPlayed) { SoundManager.playWin(); winSoundPlayed = true; }
    let img = new Image();
    img.src = 'assets/img/You won, you lost/You win B.png';
    img.onload = () => { drawEndScreen(img, 'win'); };
}

function showLoseScreen() {
    gameState = 'lose';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    SoundManager.stopGameplay();
    if (!gameIsMuted && !loseSoundPlayed) { SoundManager.playLose(); loseSoundPlayed = true; }
    let img = new Image();
    img.src = 'assets/img/You won, you lost/You lost.png';
    img.onload = () => { drawEndScreen(img, 'lose'); };
}

function drawEndScreen(img, type) {
    endScreenImage = img;
    let opacity = 0, scale = 1.2;
    
    // Dynamische Bildgröße basierend auf Canvas
    let maxWidth = canvas.width * 0.6;
    let maxHeight = canvas.height * 0.6;
    let imgAspect = img.width / img.height;
    
    let w, h;
    if (maxWidth / imgAspect <= maxHeight) {
        w = maxWidth;
        h = maxWidth / imgAspect;
    } else {
        h = maxHeight;
        w = maxHeight * imgAspect;
    }
    
    let x = (canvas.width - w) / 2;
    let y = (canvas.height - h) / 2;
    
    let fadeInterval = setInterval(() => {
        drawEndScreenFrame(img, x, y, w, h, opacity, scale);
        if (opacity < 1) opacity += 0.04;
        if (scale > 1) scale -= 0.02;
        if (opacity >= 1 && scale <= 1) {
            clearInterval(fadeInterval);
            setupWinLoseButtons(type);
            drawWinLoseButtons();
            gameState = type;
        }
    }, 50);
}

function drawEndScreenFrame(img, x, y, w, h, opacity, scale) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Kein schwarzer Hintergrund mehr - nur opacity für Fade-In
    ctx.globalAlpha = opacity;
    let drawW = w * scale, drawH = h * scale;
    let drawX = x - (drawW - w) / 2, drawY = y - (drawH - h) / 2;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.globalAlpha = 1;
}

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

// NEU: Funktion für "Zurück zum Menü"
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
    img.src = 'assets/img/You won, you lost/You win B.png';
    img.onload = () => { drawEndScreen(img, 'win'); };
}

function showLoseScreen() {
    gameState = 'lose';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    SoundManager.stopGameplay();
    if (!gameIsMuted && !loseSoundPlayed) { SoundManager.playLose(); loseSoundPlayed = true; }
    let img = new Image();
    img.src = 'assets/img/You won, you lost/You lost.png';
    img.onload = () => { drawEndScreen(img, 'lose'); };
}

function drawEndScreen(img, type) {
    endScreenImage = img;
    let opacity = 0, scale = 1.2;
    
    // Dynamische Bildgröße basierend auf Canvas
    let maxWidth = canvas.width * 0.6;
    let maxHeight = canvas.height * 0.6;
    let imgAspect = img.width / img.height;
    
    let w, h;
    if (maxWidth / imgAspect <= maxHeight) {
        w = maxWidth;
        h = maxWidth / imgAspect;
    } else {
        h = maxHeight;
        w = maxHeight * imgAspect;
    }
    
    let x = (canvas.width - w) / 2;
    let y = (canvas.height - h) / 2;
    
    let fadeInterval = setInterval(() => {
        drawEndScreenFrame(img, x, y, w, h, opacity, scale);
        if (opacity < 1) opacity += 0.04;
        if (scale > 1) scale -= 0.02;
        if (opacity >= 1 && scale <= 1) {
            clearInterval(fadeInterval);
            setupWinLoseButtons(type);
            drawWinLoseButtons();
            gameState = type;
        }
    }, 50);
}

function redrawEndScreen() {
    if (!endScreenImage) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dynamische Bildgröße basierend auf Canvas
    let maxWidth = canvas.width * 0.6;
    let maxHeight = canvas.height * 0.6;
    let imgAspect = endScreenImage.width / endScreenImage.height;
    
    let w, h;
    if (maxWidth / imgAspect <= maxHeight) {
        w = maxWidth;
        h = maxWidth / imgAspect;
    } else {
        h = maxHeight;
        w = maxHeight * imgAspect;
    }
    
    let x = (canvas.width - w) / 2;
    let y = (canvas.height - h) / 2;
    
    ctx.drawImage(endScreenImage, x, y, w, h);
    drawWinLoseButtons();
}

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

function setupWinLoseButtons(type) {
    let w = Math.min(200, canvas.width * 0.25); // Button-Breite anpassbar
    let h = 60;
    let totalButtons = 2;
    let totalButtonWidth = w * totalButtons;
    let availableSpace = canvas.width - totalButtonWidth;
    let spacing = availableSpace / (totalButtons + 1);
    
    let x1 = spacing;
    let x2 = spacing + w + spacing;
    let y = Math.max(75, canvas.height * 0.15); // min 75px oder 15% der Canvas-Höhe
    
    menuButtons = [
        { 
            text: 'Restart', 
            x: x1, 
            y, 
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
            x: x2, 
            y, 
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

function drawMenuButtons() {
    menuButtons.forEach((btn, idx) => drawButton(btn, idx, "#FFD700", "#FFA500", 0));
}

function drawWinLoseButtons() {
    menuButtons.forEach((btn, idx) => drawButton(btn, idx, "#FFD700", "#FFA500", 0));
}

function drawButton(btn, idx, hoverColor, normalColor, radius) {
    ctx.save();
    
    if (gameState === 'start' || gameState === 'win' || gameState === 'lose') {
        ctx.fillStyle = (idx === hoveredButtonIndex) ? "#FFD700" : "#FFA500";
        
        // Schriftgröße dynamisch anpassen (max 38px, mindestens 24px)
        let fontSize = Math.min(38, Math.max(24, canvas.width / 20));
        ctx.font = `bold ${fontSize}px 'Luckiest Guy', cursive`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        
        ctx.fillText(btn.text, btn.x + btn.w / 2, btn.y + btn.h / 2);
    }
    
    ctx.restore();
}

function startGame() {
    if (world) {
        world.clearAllIntervals();
        world.gameStopped = true;
        world = null;
    }
    
    canvas.classList.remove('fullscreen');
    canvas.width = 720; 
    canvas.height = 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    world = new World(canvas, keyboard);
    world.showWinScreen = showWinScreen;
    world.showLoseScreen = showLoseScreen;
    if (world.character) world.character.loseScreenShown = false;
    
    gameState = 'playing';
    
    // NEU: Nur Sound starten, wenn nicht gemutet (verhindert Browser-Warnung)
    if (!gameIsMuted) {
        // Verwende setTimeout um sicherzustellen, dass User-Interaktion erkannt wird
        setTimeout(() => {
            SoundManager.playGameplay();
        }, 100);
    }
}

// Toggle global fullscreen and update icons
function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    const containerEl = document.querySelector('.container');
    
    if (isFullscreen) {
        if (containerEl) containerEl.classList.add('fullscreen');

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        
        canvas.classList.add('fullscreen');
        canvas.width = vw;
        canvas.height = vh;
        canvas.style.width = vw + 'px';
        canvas.style.height = vh + 'px';

        if (world && world.draw) {
            requestAnimationFrame(() => world.draw());
        }
        
        updateIconPositions(); // Icons nach Fullscreen-Wechsel aktualisieren
    } else {
        if (containerEl) containerEl.classList.remove('fullscreen');

        canvas.classList.remove('fullscreen');
        canvas.width = 720;
        canvas.height = 480;
        canvas.style.width = '720px';
        canvas.style.height = '480px';

        if (world && world.draw) {
            requestAnimationFrame(() => world.draw());
        }
        
        updateIconPositions(); // Icons nach Fullscreen-Exit aktualisieren
    }

    // Fullscreen-Icon aktualisieren (optional)
    const fsImg = document.querySelector('#fullscreen-btn img');
    if (fsImg) {
        fsImg.src = 'assets/img/10_button_icons/fullscreen.png';
    }

    // Menüs neu zeichnen falls im Menü-Zustand
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

// NEU: Zeigt/versteckt Rotations-Hinweis basierend auf Orientation
function updateRotateHint() {
    const rotateHint = document.getElementById('rotate-screen-hint');
    if (!rotateHint) return;

    const isPortrait = window.innerHeight > window.innerWidth;
    const isSmallScreen = window.innerWidth <= 768;

    if (isPortrait && isSmallScreen) {
        // Zeige Rotations-Hinweis
        rotateHint.style.display = 'flex';
        
        // Verhindere Scrollen auf allen Ebenen
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.top = '0';
        document.body.style.left = '0';
        
        // Scrolle zum Anfang
        window.scrollTo(0, 0);
        
        // Verhindere Touch-Scroll-Events
        document.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
        // Verstecke Rotations-Hinweis
        rotateHint.style.display = 'none';
        
        // Stelle Scrollen wieder her
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.top = '';
        document.body.style.left = '';
        
        // Entferne Touch-Scroll-Prevention
        document.removeEventListener('touchmove', preventScroll);
    }
}

// Hilfsfunktion zum Verhindern von Scroll-Events
function preventScroll(e) {
    e.preventDefault();
}
window.addEventListener('DOMContentLoaded', init);
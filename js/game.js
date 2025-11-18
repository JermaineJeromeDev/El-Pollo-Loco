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
let canvasSnapshot = null;
let snapshotImage = null;

/**
 * Initializes the game
 */
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    loadAllSounds();
    setupCanvasListeners();
    setupMobileEvents();
    initMuteButton();
    initFullscreenButton();
    
    updateIconPositions();
    updateRotateHint();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', updateRotateHint);
    
    drawStartScreen();
}

/**
 * Handles resize events
 */
function handleResize() {
    updateIconPositions();
    updateRotateHint();
}

/**
 * Loads all sound files
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
 * Starts a new game
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
 * Cleans up old world instance
 */
function cleanupOldWorld() {
    if (!world) return;
    
    world.clearAllIntervals();
    world.gameStopped = true;
    world = null;
}

/**
 * Resets canvas to default size
 */
function resetCanvas() {
    canvas.classList.remove('fullscreen');
    // NEU: Canvas-Größe wird durch CSS gesteuert (aspect-ratio)
    // Interne Auflösung bleibt 720x480 für Spiel-Logik
    canvas.width = 720; 
    canvas.height = 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Creates new world instance
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
 * Draws the start screen
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
 * Draws background image scaled
 * @param {Image} img - The image to draw
 */
function drawScaledBackground(img) {
    const imgAspect = img.width / img.height;
    const canvasAspect = canvas.width / canvas.height;
    const dimensions = calculateBackgroundDimensions(imgAspect, canvasAspect);
    ctx.drawImage(img, dimensions.offsetX, dimensions.offsetY, dimensions.drawWidth, dimensions.drawHeight);
}

/**
 * Calculates background dimensions
 * @param {number} imgAspect - Image aspect ratio
 * @param {number} canvasAspect - Canvas aspect ratio
 * @returns {Object} Dimensions
 */
function calculateBackgroundDimensions(imgAspect, canvasAspect) {
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
    
    return { drawWidth, drawHeight, offsetX, offsetY };
}

/**
 * Shows the win screen (HTML Overlay Version)
 */
function showWinScreen() {
    gameState = 'win';
    saveCanvasSnapshot();
    SoundManager.stopGameplay();
    if (!gameIsMuted && !winSoundPlayed) { 
        SoundManager.playWin(); 
        winSoundPlayed = true; 
    }
    
    // Snapshot als CSS Background setzen
    const winOverlay = document.getElementById('win-overlay');
    const snapshotDiv = document.getElementById('win-snapshot');
    snapshotDiv.style.backgroundImage = `url(${canvasSnapshot})`;
    
    // Overlay einblenden
    winOverlay.classList.remove('d-none');
}

/**
 * Shows the lose screen (HTML Overlay Version)
 */
function showLoseScreen() {
    gameState = 'lose';
    saveCanvasSnapshot();
    SoundManager.stopGameplay();
    if (!gameIsMuted && !loseSoundPlayed) { 
        SoundManager.playLose(); 
        loseSoundPlayed = true; 
    }
    
    const loseOverlay = document.getElementById('lose-overlay');
    const snapshotDiv = document.getElementById('lose-snapshot');
    snapshotDiv.style.backgroundImage = `url(${canvasSnapshot})`;
    
    loseOverlay.classList.remove('d-none');
}

function restartGame() {
    document.getElementById('win-overlay').classList.add('d-none');
    document.getElementById('lose-overlay').classList.add('d-none');
    winSoundPlayed = false;
    loseSoundPlayed = false;
    startGame();
}

function backToMenu() {
    document.getElementById('win-overlay').classList.add('d-none');
    document.getElementById('lose-overlay').classList.add('d-none');
    winSoundPlayed = false;
    loseSoundPlayed = false;
    drawStartScreen();
}

/**
 * Saves current canvas content as snapshot
 */
function saveCanvasSnapshot() {
    if (!canvas) return;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCtx.drawImage(canvas, 0, 0); // Kopiert aktuellen Canvas-Inhalt
    canvasSnapshot = tempCanvas.toDataURL(); // Konvertiert zu Base64-String
}

/**
 * Draws saved snapshot as background (synchronous)
 */
function drawSnapshotBackground() {
    if (!canvasSnapshot || !snapshotImage) {
        if (canvasSnapshot && !snapshotImage) {
            snapshotImage = new Image();
            snapshotImage.src = canvasSnapshot;
        }
        return;
    }
    
    ctx.drawImage(snapshotImage, 0, 0, canvas.width, canvas.height);
    
    // Dunkler Overlay über dem Snapshot
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draws the end screen
 * @param {Image} img - The image to draw
 * @param {string} type - 'win' or 'lose'
 */
function drawEndScreen(img, type) {
    console.log('drawEndScreen called with type:', type); // DEBUG
    endScreenImage = img;
    
    if (canvasSnapshot) {
        snapshotImage = new Image();
        snapshotImage.src = canvasSnapshot;
        snapshotImage.onload = () => {
            console.log('Snapshot image loaded'); // DEBUG
            const dimensions = calculateImageDimensions(img);
            startFadeInAnimation(img, dimensions, type);
        };
    } else {
        console.log('No snapshot, starting animation directly'); // DEBUG
        const dimensions = calculateImageDimensions(img);
        startFadeInAnimation(img, dimensions, type);
    }
}

/**
 * Calculates image dimensions for end screen
 * @param {Image} img - The image
 * @returns {Object} Dimensions {x, y, w, h}
 */
function calculateImageDimensions(img) {
    const maxWidth = canvas.width * 0.75;
    const maxHeight = canvas.height * 0.75;
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
 * Starts fade-in animation
 * @param {Image} img - The image
 * @param {Object} dimensions - Dimensions
 * @param {string} type - 'win' or 'lose'
 */
function startFadeInAnimation(img, dimensions, type) {
    let opacity = 0;
    let scale = 1.2;
    
    const fadeInterval = setInterval(() => {
        drawEndScreenFrame(img, dimensions, opacity, scale);
        opacity = updateOpacity(opacity);
        scale = updateScale(scale);
        
        if (shouldFinishAnimation(opacity, scale)) {
            clearInterval(fadeInterval);
            finishEndScreen(type);
        }
    }, 50);
}

/**
 * Updates opacity value
 * @param {number} opacity - Current opacity
 * @returns {number} New opacity
 */
function updateOpacity(opacity) {
    return Math.min(1, opacity + 0.04);
}

/**
 * Updates scale value
 * @param {number} scale - Current scale
 * @returns {number} New scale
 */
function updateScale(scale) {
    return Math.max(1, scale - 0.02);
}

/**
 * Checks if animation should finish
 * @param {number} opacity - Current opacity
 * @param {number} scale - Current scale
 * @returns {boolean}
 */
function shouldFinishAnimation(opacity, scale) {
    return opacity >= 1 && scale <= 1;
}

/**
 * Initializes mobile button visibility
 */
function setupMobileEvents() {
    initMobileBtnsVisibility();
    setupMobileControls();
}

/**
 * Initializes mobile button visibility listeners
 */
function initMobileBtnsVisibility() {
    updateMobileBtnsVisibility();
    window.addEventListener('resize', updateMobileBtnsVisibility);
    window.addEventListener('orientationchange', updateMobileBtnsVisibility);
}

/**
 * Sets up mobile control buttons
 */
function setupMobileControls() {
    const controls = [
        { id: 'walk-left', key: 'LEFT' },
        { id: 'walk-right', key: 'RIGHT' },
        { id: 'jump', key: 'SPACE' },
        { id: 'throw', key: 'D' }
    ];

    controls.forEach(control => addMobileControlListener(control));
}

/**
 * Adds listener to mobile control
 * @param {Object} control - Control configuration
 */
function addMobileControlListener(control) {
    const btn = document.getElementById(control.id);
    if (!btn) {
        console.warn(`Mobile button #${control.id} not found`);
        return;
    }
    
    // Touchstart Event
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        keyboard[control.key] = true;
        console.log(`Touch START: ${control.key} = true`);
    }, { passive: false });
    
    // Touchend Event
    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        keyboard[control.key] = false;
        console.log(`Touch END: ${control.key} = false`);
    }, { passive: false });

    // Touchcancel Event (falls Touch unterbrochen wird)
    btn.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        keyboard[control.key] = false;
    }, { passive: false });
}

/**
 * Checks if mobile landscape
 */
function isMobileLandscape() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Nur bei echten Touch-Geräten UND Landscape UND kleiner als 900px
    return isTouchDevice && isLandscape && width <= 900;
}

/**
 * Updates mobile button visibility
 */
function updateMobileBtnsVisibility() {
    const mobileBtns = document.getElementById('mobile-btns');
    if (!mobileBtns) {
        console.error('Mobile buttons element (#mobile-btns) not found!');
        return;
    }
    
    const shouldShow = isMobileLandscape();
    mobileBtns.style.display = shouldShow ? 'block' : 'none';
    
    console.log('Mobile buttons:', {
        shouldShow,
        width: window.innerWidth,
        height: window.innerHeight,
        isLandscape: window.innerWidth > window.innerHeight,
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    });
}

/**
 * Handles keydown events
 */
function handleKeyDown(event) {
    if (event.key === 'Escape') toggleFullscreen();
    if (gameState !== 'playing') return;
    setKeyState(event.keyCode, true);
}

/**
 * Handles keyup events
 */
function handleKeyUp(event) {
    if (gameState !== 'playing') return;
    setKeyState(event.keyCode, false);
}

/**
 * Sets keyboard state
 */
function setKeyState(keyCode, state) {
    if (keyCode === 37) keyboard.LEFT = state;
    if (keyCode === 39) keyboard.RIGHT = state;
    if (keyCode === 32) keyboard.SPACE = state;
    if (keyCode === 68) keyboard.D = state;
}

/**
 * Displays the options/settings screen by showing the options modal.
 * This function is called to present configuration options to the user.
 */
function drawOptionsScreen() {
    pauseGame(); // NEU: Pausiere Spiel
    showOptionsModal();
}

/**
 * Pauses the game
 */
function pauseGame() {
    if (world) {
        world.gamePaused = true;
        console.log('Game paused');
    }
}

/**
 * Resumes the game
 */
function resumeGame() {
    if (world) {
        world.gamePaused = false;
        console.log('Game resumed');
    }
}

/**
 * Sets up canvas listeners for menu interactions
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
 * Handles menu clicks
 */
function handleMenuClick(event) {
    let { x, y } = getMousePos(event);
    menuButtons.forEach(btn => {
        if (isPointInButton(x, y, btn)) btn.onClick();
    });
}

/**
 * Handles menu hover
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
 * Handles menu touch
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
 * Handles touch move events
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
 * Gets mouse position relative to canvas
 */
function getMousePos(event) {
    let rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

/**
 * Checks if point is inside button
 */
function isPointInButton(mx, my, btn) {
    return mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h;
}

/**
 * Redraws menu screen
 */
function redrawMenuScreen() {
    if (gameState === 'start') drawStartScreen();
    if (gameState === 'win' || gameState === 'lose') redrawEndScreen();
}

/**
 * Redraws end screen
 */
function redrawEndScreen() {
    if (!endScreenImage) return;
    
    drawSnapshotBackground();
    const dimensions = calculateImageDimensions(endScreenImage);
    ctx.drawImage(endScreenImage, dimensions.x, dimensions.y, dimensions.w, dimensions.h);
    drawWinLoseButtons();
}

/**
 * Sets up win/lose buttons
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
 * Draws menu buttons
 */
function drawMenuButtons() {
    menuButtons.forEach((btn, idx) => drawButton(btn, idx));
}

/**
 * Draws win/lose buttons
 */
function drawWinLoseButtons() {
    menuButtons.forEach((btn, idx) => drawButton(btn, idx));
}

/**
 * Draws single button
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
 * Finishes end screen animation
 * @param {string} type - 'win' or 'lose'
 */
function finishEndScreen(type) {
    setupWinLoseButtons(type);
    drawWinLoseButtons();
    gameState = type;
}

/**
 * Draws a frame of the end screen
 * @param {Image} img - The image
 * @param {Object} dimensions - {x, y, w, h}
 * @param {number} opacity - Opacity
 * @param {number} scale - Scale
 */
function drawEndScreenFrame(img, dimensions, opacity, scale) {
    drawSnapshotBackground();
    
    ctx.globalAlpha = opacity;
    const drawW = dimensions.w * scale;
    const drawH = dimensions.h * scale;
    const drawX = dimensions.x - (drawW - dimensions.w) / 2;
    const drawY = dimensions.y - (drawH - dimensions.h) / 2;
    
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.globalAlpha = 1;
}

/**
 * Sets up start menu buttons
 */
function setupStartMenuButtons() {
    const w = Math.min(200, canvas.width * 0.3);
    const h = 60;
    const x = (canvas.width - w) / 2;
    const y = Math.max(60, canvas.height * 0.125);
    
    menuButtons = [{
        text: 'Start Game',
        x, y, w, h,
        onClick: () => {
            gameState = 'playing';
            menuButtons = [];
            startGame();
        }
    }];
}

/**
 * Initializes fullscreen button
 */
function initFullscreenButton() {
    const fsBtn = document.getElementById('fullscreen-btn');
    if (!fsBtn) return;
    fsBtn.addEventListener('click', () => {
        toggleFullscreen();
        if (document.activeElement) {
            document.activeElement.blur();
        }
    });
}

/**
 * Toggles fullscreen mode
 */
function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    const containerEl = document.querySelector('.container');
    
    if (isFullscreen) {
        if (containerEl) containerEl.classList.add('fullscreen');
        canvas.classList.add('fullscreen');
        // NEU: Behält aspect-ratio bei
        const aspectRatio = 3 / 2;
        if (window.innerWidth / window.innerHeight > aspectRatio) {
            canvas.height = window.innerHeight;
            canvas.width = window.innerHeight * aspectRatio;
        } else {
            canvas.width = window.innerWidth;
            canvas.height = window.innerWidth / aspectRatio;
        }
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
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
 * Calculates background dimensions for proper scaling without distortion
 * Uses aspect ratio to determine whether to fit by width or height
 * @param {number} imgAspect - Image aspect ratio (width/height)
 * @param {number} canvasAspect - Canvas aspect ratio (width/height)
 * @returns {Object} Dimensions {drawWidth, drawHeight, offsetX, offsetY}
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
    SoundManager.stopGameplay();
    if (!gameIsMuted && !winSoundPlayed) { 
        SoundManager.playWin(); 
        winSoundPlayed = true; 
    }
    const winOverlay = document.getElementById('win-overlay');
    winOverlay.classList.remove('d-none');
}

/**
 * Shows the lose screen (HTML Overlay Version)
 */
function showLoseScreen() {
    gameState = 'lose';
    SoundManager.stopGameplay();
    if (!gameIsMuted && !loseSoundPlayed) { 
        SoundManager.playLose(); 
        loseSoundPlayed = true; 
    }
    const loseOverlay = document.getElementById('lose-overlay');
    loseOverlay.classList.remove('d-none');
}

/**
 * Restarts the game from win/lose screen
 */
function restartGame() {
    document.getElementById('win-overlay').classList.add('d-none');
    document.getElementById('lose-overlay').classList.add('d-none');
    winSoundPlayed = false;
    loseSoundPlayed = false;
    startGame();
}

/**
 * Returns to main menu from win/lose screen
 */
function backToMenu() {
    document.getElementById('win-overlay').classList.add('d-none');
    document.getElementById('lose-overlay').classList.add('d-none');
    winSoundPlayed = false;
    loseSoundPlayed = false;
    drawStartScreen();
}

/**
 * Draws the end screen
 * @param {Image} img - The image to draw
 * @param {string} type - 'win' or 'lose'
 */
function drawEndScreen(img, type) {
    endScreenImage = img;
    if (canvasSnapshot) {
        snapshotImage = new Image();
        snapshotImage.src = canvasSnapshot;
        snapshotImage.onload = () => {
            const dimensions = calculateImageDimensions(img);
            startFadeInAnimation(img, dimensions, type);
        };
    } else {
        const dimensions = calculateImageDimensions(img);
        startFadeInAnimation(img, dimensions, type);
    }
}

/**
 * Calculates maximum dimensions for end screen image
 * @returns {Object} Max dimensions {maxWidth, maxHeight}
 */
function calculateMaxDimensions() {
    return {
        maxWidth: canvas.width * 0.75,
        maxHeight: canvas.height * 0.75
    };
}

/**
 * Calculates image size based on aspect ratio
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @param {number} imgAspect - Image aspect ratio
 * @returns {Object} Image size {w, h}
 */
function calculateImageSize(maxWidth, maxHeight, imgAspect) {
    let w, h;
    if (maxWidth / imgAspect <= maxHeight) {
        w = maxWidth;
        h = maxWidth / imgAspect;
    } else {
        h = maxHeight;
        w = maxHeight * imgAspect;
    }
    return { w, h };
}

/**
 * Calculates centered position for image
 * @param {number} w - Image width
 * @param {number} h - Image height
 * @returns {Object} Position {x, y}
 */
function calculateCenteredPosition(w, h) {
    return {
        x: (canvas.width - w) / 2,
        y: (canvas.height - h) / 2
    };
}

/**
 * Calculates image dimensions for end screen
 * @param {Image} img - The image
 * @returns {Object} Dimensions {x, y, w, h}
 */
function calculateImageDimensions(img) {
    const { maxWidth, maxHeight } = calculateMaxDimensions();
    const imgAspect = img.width / img.height;
    const { w, h } = calculateImageSize(maxWidth, maxHeight, imgAspect);
    const { x, y } = calculateCenteredPosition(w, h);
    
    return { x, y, w, h };
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
 * Handles touch start event
 * @param {Event} event - Touch event
 * @param {string} key - Keyboard key
 */
function handleTouchStart(event, key) {
    event.preventDefault();
    event.stopPropagation();
    keyboard[key] = true;
    console.log(`Touch START: ${key} = true`);
}

/**
 * Handles touch end event
 * @param {Event} event - Touch event
 * @param {string} key - Keyboard key
 */
function handleTouchEnd(event, key) {
    event.preventDefault();
    event.stopPropagation();
    keyboard[key] = false;
    console.log(`Touch END: ${key} = false`);
}

/**
 * Handles touch cancel event
 * @param {Event} event - Touch event
 * @param {string} key - Keyboard key
 */
function handleTouchCancel(event, key) {
    event.preventDefault();
    keyboard[key] = false;
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
    btn.addEventListener('touchstart', (e) => handleTouchStart(e, control.key), { passive: false });
    btn.addEventListener('touchend', (e) => handleTouchEnd(e, control.key), { passive: false });
    btn.addEventListener('touchcancel', (e) => handleTouchCancel(e, control.key), { passive: false });
}

/**
 * Checks if mobile landscape
 */
function isMobileLandscape() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;
    const isSmallScreen = width <= 900; 
    return isLandscape && isSmallScreen;
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
    if (!world) {
        console.warn('Cannot pause: world does not exist');
        return;
    }
    world.gamePaused = true;
    console.log('✅ Game paused - gamePaused:', world.gamePaused);
}

/**
 * Resumes the game
 */
function resumeGame() {
    if (!world) {
        console.warn('Cannot resume: world does not exist');
        return;
    }
    world.gamePaused = false;
    console.log('▶️ Game resumed - gamePaused:', world.gamePaused);
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
    event.preventDefault();
    event.stopPropagation();
    let { x, y } = getMousePos(event);
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    x = x * scaleX;
    y = y * scaleY;
    menuButtons.forEach((btn, index) => {
        if (isPointInButton(x, y, btn)) {
            btn.onClick();
        }
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
 * Calculates button dimensions
 * @returns {Object} Button dimensions {w, h, spacing}
 */
function calculateButtonDimensions() {
    const w = Math.min(200, canvas.width * 0.25);
    const h = 60;
    const spacing = (canvas.width - (w * 2)) / 3;
    return { w, h, spacing };
}

/**
 * Creates restart button configuration
 * @param {number} w - Button width
 * @param {number} h - Button height
 * @param {number} spacing - Button spacing
 * @returns {Object} Button configuration
 */
function createRestartButton(w, h, spacing) {
    return { 
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
    };
}

/**
 * Creates back to menu button configuration
 * @param {number} w - Button width
 * @param {number} h - Button height
 * @param {number} spacing - Button spacing
 * @returns {Object} Button configuration
 */
function createBackToMenuButton(w, h, spacing) {
    return { 
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
    };
}

/**
 * Sets up win/lose buttons
 */
function setupWinLoseButtons(type) {
    const { w, h, spacing } = calculateButtonDimensions();
    menuButtons = [
        createRestartButton(w, h, spacing),
        createBackToMenuButton(w, h, spacing)
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
 * Adds fullscreen class to elements
 * @param {HTMLElement} containerEl - Container element
 */
function addFullscreenClasses(containerEl) {
    if (containerEl) containerEl.classList.add('fullscreen');
    canvas.classList.add('fullscreen');
}

/**
 * Removes fullscreen class from elements
 * @param {HTMLElement} containerEl - Container element
 */
function removeFullscreenClasses(containerEl) {
    if (containerEl) containerEl.classList.remove('fullscreen');
    canvas.classList.remove('fullscreen');
}

/**
 * Updates canvas dimensions
 */
function updateCanvasDimensions() {
    canvas.width = 720;
    canvas.height = 480;
}

/**
 * Redraws screen after fullscreen toggle
 */
function redrawAfterFullscreen() {
    updateIconPositions();
    if (gameState === 'start') {
        setTimeout(() => drawStartScreen(), 100);
    } else if (world && world.draw) {
        requestAnimationFrame(() => world.draw());
    }
}

/**
 * Toggles fullscreen mode
 */
function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    const containerEl = document.querySelector('.container');
    
    if (isFullscreen) {
        addFullscreenClasses(containerEl);
    } else {
        removeFullscreenClasses(containerEl);
    }
    
    updateCanvasDimensions();
    redrawAfterFullscreen();
}

/**
 * Initializes the game on DOMContentLoaded
 */
window.addEventListener('DOMContentLoaded', init);

/**
 * Gets touch coordinates
 * @param {Touch} touch - Touch object
 * @param {DOMRect} rect - Canvas bounding rect
 * @returns {Object} Coordinates {x, y}
 */
function getTouchCoordinates(touch, rect) {
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: x * scaleX, y: y * scaleY };
}

/**
 * Handles button click from touch
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
function handleButtonTouch(x, y) {
    menuButtons.forEach(btn => {
        if (isPointInButton(x, y, btn)) {
            btn.onClick();
        }
    });
}

/**
 * Handles menu touch
 */
function handleMenuTouch(event) {
    event.preventDefault();
    event.stopPropagation();
    
    let touch = event.touches[0];
    if (!touch) return;
    
    let rect = canvas.getBoundingClientRect();
    const { x, y } = getTouchCoordinates(touch, rect);
    handleButtonTouch(x, y);
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
    const { x, y } = getTouchCoordinates(touch, rect);
    
    hoveredButtonIndex = -1;
    menuButtons.forEach((btn, idx) => {
        if (isPointInButton(x, y, btn)) hoveredButtonIndex = idx;
    });
    redrawMenuScreen();
}
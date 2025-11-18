/**
 * Main game entry point
 */

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
 * Initializes the game on DOMContentLoaded
 */
window.addEventListener('DOMContentLoaded', init);

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


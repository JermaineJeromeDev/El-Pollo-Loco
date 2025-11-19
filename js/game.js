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
 * Initializes the game by setting up the canvas, loading sounds, configuring event listeners,
 * and preparing UI elements such as mute and fullscreen buttons. Also handles responsive
 * adjustments and displays the start screen.
 */
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    resizeCanvasToContainer(); 
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
 * Handles the window resize event by adjusting the canvas size,
 * updating icon positions, and refreshing the rotate hint.
 */
function handleResize() {
    resizeCanvasToContainer(); 
    updateIconPositions();
    updateRotateHint();
}

/**
 * Initializes the game on DOMContentLoaded
 */
window.addEventListener('DOMContentLoaded', init);

/**
 * Initializes and starts a new game session.
 * - Cleans up any existing game world.
 * - Resets the game canvas.
 * - Creates a new game world.
 * - Sets the game state to 'playing'.
 * - Plays gameplay sound if the game is not muted.
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
 * Cleans up the current game world by clearing all intervals,
 * stopping the game, and resetting the world reference.
 * Does nothing if no world exists.
 */
function cleanupOldWorld() {
    if (!world) return;
    world.clearAllIntervals();
    world.gameStopped = true;
    world = null;
}

/**
 * Resets the canvas to its default size and clears its contents.
 * Removes the 'fullscreen' class from the canvas element,
 * sets the canvas width to 720 and height to 480,
 * and clears the drawing context.
 */
function resetCanvas() {
    canvas.classList.remove('fullscreen');
    canvas.width = 720; 
    canvas.height = 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Initializes a new instance of the World class using the provided canvas and keyboard.
 * Assigns win and lose screen display functions to the world instance.
 * Resets the lose screen state for the character if it exists.
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
 * Draws the start screen of the game by setting the game state,
 * loading the background image, clearing the canvas, drawing the scaled background,
 * and setting up and drawing the start menu buttons.
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
 * Resets the game overlays and sound flags, then redraws the start screen.
 * Hides both win and lose overlays, resets sound played flags, and displays the start menu.
 */
function backToMenu() {
    document.getElementById('win-overlay').classList.add('d-none');
    document.getElementById('lose-overlay').classList.add('d-none');
    winSoundPlayed = false;
    loseSoundPlayed = false;
    drawStartScreen();
}
